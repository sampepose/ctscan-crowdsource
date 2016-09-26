CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE User (
  user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  username varchar(25) NOT NULL,
  password varchar(25) NOT NULL
);

CREATE TABLE Image (
  image_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  image_uri text NOT NULL
);

CREATE TABLE UserImageJoin (
  user_id uuid NOT NULL REFERENCES User(user_id),
  image_id uuid NOT NULL REFERENCES Image(image_id),
  bounding_box box2d NOT NULL
);
