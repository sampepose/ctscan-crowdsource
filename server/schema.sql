CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  username varchar(25) NOT NULL,
  password varchar(25) NOT NULL
);

CREATE TABLE Images (
  image_id SERIAL PRIMARY KEY,
  image_uri text NOT NULL
);

CREATE TABLE UserImageJoins (
  user_id integer NOT NULL REFERENCES Users(user_id),
  image_id integer NOT NULL REFERENCES Images(image_id),
  bounding_box box NOT NULL
);
