import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { jwtPayload } from 'jwt-payloader';
import { Post } from 'src/posts/schemas/post.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.userModel.find({}, { password: 0 }).exec();
  }

  async findOne(did: string) {
    return await this.userModel.findOne({ did }, { password: 0 }).exec();
  }

  async update(req: Request, updateUserDto: UserDto) {
    const { sub } = jwtPayload(req);

    try {
      await this.userModel
        .findByIdAndUpdate(sub, {
          ...updateUserDto,
        })
        .exec();

      // find the documents that need updating
      const usersToUpdate = await this.userModel.find({
        $or: [
          { 'followers.did': updateUserDto.did },
          { 'following.did': updateUserDto.did },
        ],
      });

      for (const user of usersToUpdate) {
        // Update followers
        user.followers = user.followers.map((follower) =>
          follower.did === updateUserDto.did
            ? { ...follower, avatarURL: updateUserDto.avatarURL }
            : follower,
        );

        // Update following
        user.following = user.following.map((followedUser) =>
          followedUser.did === updateUserDto.did
            ? { ...followedUser, avatarURL: updateUserDto.avatarURL }
            : followedUser,
        );

        // Save the updated user
        await user.save();
      }

      await this.postModel.updateMany(
        { userId: sub },
        { avatarURL: updateUserDto.avatarURL },
      );

      await this.postModel
        .updateMany(
          {
            $or: [{ 'comments.userId': sub }, { 'likes.likedBy._id': sub }],
          },
          {
            $set: {
              'comments.$[comment].avatarURL': updateUserDto.avatarURL,
              'likes.likedBy.$[likedBy].avatarURL': updateUserDto.avatarURL,
            },
          },
          {
            arrayFilters: [{ 'comment.userId': sub }, { 'likedBy._id': sub }],
            multi: true,
          },
        )
        .exec();

      return await this.userModel.findById(sub, { password: 0 }).exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async findBookmarks(req: Request) {
    const { sub } = jwtPayload(req);

    return await this.userModel
      .findById(sub, { bookmarks: -1, password: 0 })
      .exec();
  }

  async addBookmark(req: Request, postId: string) {
    const { sub } = jwtPayload(req);

    try {
      const { bookmarks } = await this.userModel.findById(sub).exec();

      if (!bookmarks.includes(postId)) {
        await this.userModel
          .findByIdAndUpdate(sub, {
            bookmarks: [...bookmarks, postId],
          })
          .exec();
      }

      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async removeBookmark(req: Request, postId: string) {
    const { sub } = jwtPayload(req);

    try {
      const { bookmarks } = await this.userModel.findById(sub).exec();

      const newBookmarks = bookmarks.filter((bookmark) => bookmark !== postId);

      await this.userModel
        .findByIdAndUpdate(sub, {
          bookmarks: [...newBookmarks],
        })
        .exec();

      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async follow(req: Request, userId: string) {
    const { sub } = jwtPayload(req);

    try {
      if (userId === sub) {
        throw new InternalServerErrorException();
      }

      const { id, did, username, avatarURL, followers } = await this.userModel
        .findById(userId)
        .exec();

      const user = await this.userModel.findById(sub).exec();

      const { following } = user;

      const followingList = following.filter((follow) => follow._id !== userId);

      const follow = {
        _id: String(id),
        did,
        username,
        avatarURL,
      };

      await this.userModel
        .findByIdAndUpdate(sub, {
          following: [...followingList, follow],
        })
        .exec();

      const follower = {
        _id: sub,
        did: user.did,
        username: user.username,
        avatarURL: user.avatarURL,
      };

      const followerList = followers.filter((follow) => follow._id !== sub);

      await this.userModel
        .findByIdAndUpdate(userId, {
          followers: [...followerList, follower],
        })
        .exec();

      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async unfollow(req: Request, userId: string) {
    const { sub } = jwtPayload(req);

    try {
      // primary user
      const { following } = await this.userModel.findById(sub).exec();

      // remove follower
      const followList = following.filter(
        (follower) => follower._id !== userId,
      );

      await this.userModel
        .findByIdAndUpdate(sub, {
          following: [...followList],
        })
        .exec();

      const { followers } = await this.userModel.findById(userId).exec();

      const followerList = followers.filter((follower) => follower._id !== sub);

      await this.userModel
        .findByIdAndUpdate(userId, {
          followers: [...followerList],
        })
        .exec();

      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }
}
