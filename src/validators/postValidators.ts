import { body, param, ValidationChain } from 'express-validator';
import postModel from '../models/postModel';
import { promisify } from 'util';

const getPostByIdAsync = promisify(postModel.getPostById);

export const validatePostExistence: ValidationChain = param('id')
  .isInt()
  .withMessage('Invalid post ID')
  .custom(async (postId) => {
    try {
      const post = await getPostByIdAsync(parseInt(postId, 10));
      if (!post) {
        throw new Error('Post not found');
      }
    } catch (error: any) {
      throw new Error('Error fetching post: ' + error.message);
    }
  });

export const validateTitle: ValidationChain = body('title')
  .notEmpty()
  .withMessage('Title is required');

export const validateUrl: ValidationChain = body('url')
  .notEmpty()
  .withMessage('URL is required')
  .isURL()
  .withMessage('URL must be a valid URL');

export const validateUserIsAuthor: ValidationChain = body('userId')
  .notEmpty()
  .withMessage('User ID is required')
  .isInt()
  .withMessage('Invalid user ID')
  .custom(async (userId, { req }) => {
    const post = await getPostByIdAsync(parseInt(userId, 10));
    if (post.owner !== req.user.username) {
      throw new Error('User is not the author of the post');
    }
  });

export const validateCreatePost: ValidationChain[] = [
  validateTitle,
  validateUrl,
];

export const validateUpdatePost: ValidationChain[] = [
  validatePostExistence,
  validateTitle,
  validateUrl,
  validateUserIsAuthor,
];

export const validateDeletePost: ValidationChain[] = [
  validatePostExistence,
  validateUserIsAuthor,
];
