import express, { Request, Response } from 'express';
import { getPosts } from '../models/postModel';
import { createPost } from '../models/postModel';
import { deletePost } from '../models/postModel';
import * as postModel from '../models/postModel';
import {
  validateCreatePost,
  validateDeletePost,
  validatePostExistence,
  validateUpdatePost,
} from '../validators/postValidators';
import { validationRes } from '../validators/userValidators';
import { validationResult } from 'express-validator';

const router = express.Router();

export default router.get('/', (req: Request, res: Response) => {
  getPosts((err, posts) => {
    if (err) {
      console.error('Error getting posts:', err);
      res
        .status(500)
        .json({ error: 'An error occurred while getting the posts' });
      return;
    }

    res.json(posts);
  });
});

router.post('/', validateCreatePost, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  createPost(title, url, (err, postId) => {
    if (err) {
      console.error('Error creating post:', err);
      res
        .status(500)
        .json({ error: 'An error occurred while creating the post' });
      return;
    }

    res.status(201).json({ success: true, postId });
  });
});

router.put(
  '/:id/upvote',
  validatePostExistence,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const postId = parseInt(req.params.id, 10);

    postModel.upvotePost(postId, (error: any, result: any) => {
      if (error) {
        console.error('Error upvoting post:', error);
        res
          .status(500)
          .json({ error: 'An error occurred while upvoting the post.' });
      } else {
        res.status(200).json(result);
      }
    });
  },
);

router.put(
  '/:id/downvote',
  validatePostExistence,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const postId = parseInt(req.params.id, 10);

    postModel.downvotePost(postId, (error: any, result: any) => {
      if (error) {
        console.error('Error downvoting post:', error);
        res
          .status(500)
          .json({ error: 'An error occurred while downvoting the post.' });
      } else {
        res.status(200).json(result);
      }
    });
  },
);

router.delete('/:id', validateDeletePost, (req: Request, res: Response) => {
  validationRes(req, res);

  const postId = parseInt(req.params.id, 10);

  postModel.deletePost(postId, (error: any, result: any) => {
    if (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.put('/:id', validateUpdatePost, (req: Request, res: Response) => {
  validationRes(req, res);

  const postId = parseInt(req.params.id, 10);
  const { title, url } = req.body;

  postModel.updatePost(postId, title, url, (error: any, result: any) => {
    if (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Error updating post' });
    } else {
      res.status(200).json(result);
    }
  });
});
