import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comment, Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostDto } from './dto/post.dto';
import { jwtPayload } from 'jwt-payloader';
import { randomUUID } from 'crypto';
import { User } from 'src/users/schemas/user.schema';
import { UserPostDto } from './dto/user-post-dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.postModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async findAllUsers(query: UserPostDto) {
    try {
      const { did, skip, limit } = query;

      const posts = await this.postModel
        .find({ did: did })
        .sort({ createdAt: -1 })
        .skip(Number(skip) || 0)
        .limit(Number(limit) || 100)
        .exec();

      const totalItems = await this.postModel.countDocuments();

      return {
        ...posts,
        currentPage: Number(skip),
        totalPages: Math.ceil(totalItems / Number(limit)),
        totalItems,
      };
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async findOne(postId: string) {
    return await this.postModel.findById(postId).exec();
  }

  async findByUser(userId: string) {
    return await this.postModel.findOne({ userId: userId }).exec();
  }

  async createPost(req: Request, post: PostDto) {
    const { sub } = jwtPayload(req);

    try {
      await new this.postModel({
        ...post,
        userId: sub,
      }).save();

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async editPost(req: Request, postId: string, post: PostDto) {
    const { sub } = jwtPayload(req);

    try {
      await this.postModel.findOneAndUpdate(
        { _id: postId, userId: sub },
        { ...post },
      );

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async deletePost(postId: string) {
    try {
      await this.postModel.findByIdAndDelete(postId);

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async likePost(req: Request, postId: string) {
    const { sub } = jwtPayload(req);

    try {
      const { id, did, username, avatarURL } =
        await this.userModel.findById(sub);

      const like = {
        _id: String(id),
        did,
        username,
        avatarURL,
      };

      const { likes } = await this.postModel.findById(postId, { likes: -1 });
      const { likedBy, likeCount } = likes;

      if (likedBy && likeCount) {
        const liked = likedBy.filter((user) => user._id !== sub);

        await this.postModel.findByIdAndUpdate(postId, {
          likes: {
            likedBy: [...liked, like],
            likeCount: liked.length + 1,
          },
        });
      } else {
        await this.postModel.findByIdAndUpdate(postId, {
          likes: {
            likedBy: [like],
            likeCount: 1,
          },
        });
      }

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async dislikePost(req: Request, postId: string) {
    const { sub } = jwtPayload(req);

    try {
      const { likes } = await this.postModel.findById(postId, { likes: -1 });
      const { likedBy, likeCount } = likes;

      if (likeCount !== 0) {
        const liked = likedBy.filter((like) => like._id !== sub);

        await this.postModel.findByIdAndUpdate(postId, {
          likes: {
            likedBy: [...liked],
            likeCount: liked.length,
          },
        });
      } else {
        await this.postModel.findByIdAndUpdate(postId, {
          likes: {
            likedBy: [],
            likeCount: 0,
          },
        });
      }

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async findPostComments(postId: string) {
    return await this.postModel.findById(postId, { comments: -1 }).exec();
  }

  async addComment(req: Request, postId: string, comment: Comment) {
    const { sub } = jwtPayload(req);
    const _id = randomUUID();

    const { did, text, username, avatarURL } = comment;

    const postedComment = {
      _id,
      did,
      userId: sub,
      text,
      avatarURL,
      username,
      createdAt: new Date().toISOString(),
    };

    try {
      const post = await this.postModel.findById(postId).exec();

      if (post.comments) {
        const newComments = [...post.comments, postedComment];

        const sorted = newComments.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );

        await this.postModel
          .findByIdAndUpdate(postId, { comments: sorted })
          .exec();
      } else {
        await this.postModel
          .findByIdAndUpdate(postId, {
            comments: [postedComment],
          })
          .exec();
      }

      return await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async editComment(postId: string, update: Comment) {
    try {
      const post = await this.postModel.findById(postId).exec();

      if (post.comments) {
        const comments = post.comments;

        const remove = comments.filter((comment) => comment._id !== update._id);

        const newComments = [...remove, update];

        const sorted = newComments.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );

        await this.postModel
          .findByIdAndUpdate(postId, { comments: sorted })
          .exec();

        return await this.postModel
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .exec();
      }

      throw new InternalServerErrorException();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async deleteComment(postId: string, remove: Comment) {
    try {
      const post = await this.postModel.findById(postId).exec();

      if (post.comments) {
        const comments = post.comments;

        const update = comments.filter((comment) => comment._id !== remove._id);

        const newComments = [...update];

        const sorted = newComments.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );

        await this.postModel
          .findByIdAndUpdate(postId, { comments: sorted })
          .exec();

        return await this.postModel
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .exec();
      }

      throw new InternalServerErrorException();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }
}
