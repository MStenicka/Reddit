import db from '../database';
import { Post } from '../interfaces/postInterface';

export function createPost(
  title: string,
  url: string,
  callback: (error: Error | null, postId?: number) => void,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const query =
    'INSERT INTO posts (title, url, timestamp, score) VALUES (?, ?, ?, ?)';
  const values = [title, url, timestamp, 0];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result.insertId);
  });
}

export function getPosts(
  callback: (error: Error | null, posts: Post[]) => void,
) {
  const query = 'SELECT * FROM posts';

  db.query(query, (err, result) => {
    if (err) {
      return callback(err, []);
    }

    const posts: Post[] = result.map((row: any) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      timestamp: row.timestamp,
      score: row.score,
      owner: row.owner,
      vote: row.vote,
    }));

    callback(null, posts);
  });
}

export const upvotePost = (postId: number, callback: any) => {
  const query = 'UPDATE posts SET score = score + 1 WHERE id = ?';
  db.query(query, [postId], callback);
};

export const downvotePost = (postId: number, callback: any) => {
  const query = 'UPDATE posts SET score = score - 1 WHERE id = ?';
  db.query(query, [postId], callback);
};

export function updatePost(
  postId: number,
  title: string,
  url: string,
  callback: (error: any, result: any) => void,
) {
  const query = 'UPDATE posts SET title = ?, url = ? WHERE id = ?';
  db.query(query, [title, url, postId], (error: any, result: any) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

export function deletePost(
  postId: number,
  callback: (error: any, result: any) => void,
) {
  const query = 'DELETE FROM posts WHERE id = ?';
  db.query(query, [postId], (error: any, result: any) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

export function getPostById(
  postId: number,
  callback: (error: any, result: any) => void,
) {
  const query = 'SELECT * FROM posts WHERE id = ?';
  db.query(query, [postId], (error: any, result: any) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result[0]);
    }
  });
}

export default {
  getPosts,
  createPost,
  upvotePost,
  downvotePost,
  deletePost,
  updatePost,
  getPostById,
};
