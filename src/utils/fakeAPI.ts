// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
export type Resource<T> = {
  read(): T | undefined;
};

function wrapPromise<T>(promise: Promise<T>): Resource<T> {
  let status = 'pending';
  let result: T;
  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}

export type Post = {
  id: number;
  text: string;
};

export function fetchPosts(): Promise<Post[]> {
  console.log('fetching posts...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fetched posts');
      resolve([
        {
          id: 0,
          text: 'I get by with a little help from my friends',
        },
        {
          id: 1,
          text: "I'd like to be under the sea in an octupus's garden",
        },
        {
          id: 2,
          text: 'You got that sand all over your feet',
        },
      ]);
    }, 2000);
  });
}

export function fetchPostsReject(): Promise<Post[]> {
  console.log('fetching posts...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('rejected posts');
      reject(new Error('Error happens when fetching posts'));
    }, 2000);
  });
}

export function fetchProfileData() {
  const postsPromise = fetchPosts();
  const postsPromiseReject = fetchPostsReject();
  return {
    posts: wrapPromise(postsPromise),
    portsReject: wrapPromise(postsPromiseReject),
  };
}

export function fetchPostsResource() {
  const promise = fetchPosts();
  return wrapPromise(promise);
}

export function fetchPostsRejectResource() {
  const promise = fetchPostsReject();
  return wrapPromise(promise);
}
