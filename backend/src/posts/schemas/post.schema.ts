import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Follower } from 'src/users/schemas/user.schema';

export type Likes = {
  likeCount: number;
  likedBy: Follower[];
};

export interface Comment {
  _id: string;
  did: string;
  userId: string;
  username: string;
  avatarURL: string;
  text: string;
  createdAt?: string;
}

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true, default: '' })
  username: string;

  @Prop({ required: true, default: '' })
  did: string;

  @Prop({ required: true, default: '' })
  userId: string;

  @Prop({ required: true, default: '' })
  content: string;

  @Prop({ required: true, default: '' })
  avatarURL: string;

  @Prop({ required: false, default: '' })
  type: string;

  @Prop({ required: false, default: '' })
  mediaURL: string;

  @Prop({
    required: false,
    type: Object,
    default: { likeCount: 0, likedBy: [] },
  })
  likes: Likes;

  @Prop({
    required: false,
    type: Array,
    default: [],
  })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
