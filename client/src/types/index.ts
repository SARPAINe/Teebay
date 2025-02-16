export type User = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type Query = {
  users: User[];
  posts: Post[];
};

export type Mutation = {
  createUser(name: string, email: string): User;
  createPost(title: string, content: string, authorId: string): Post;
};