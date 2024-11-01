import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Follower {
  _id: string;
  did: string;
  username: string;
  avatarURL: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  did: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    required: true,
    default: 'https://todai.decentralbros.dev/assets/social-media-logo.png',
  })
  avatarURL: string;

  @Prop({ required: false, default: '' })
  bio: string;

  @Prop({ required: false, default: '' })
  website: string;

  @Prop({ required: false, default: [], type: Array })
  bookmarks: string[];

  @Prop({ required: false, default: [], type: Array })
  following: Follower[];

  @Prop({ required: false, default: [], type: Array })
  followers: Follower[];
}

export const UserSchema = SchemaFactory.createForClass(User);
