set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

SET TIMEZONE='America/Los_angeles';

CREATE TABLE "streamers" (
	"streamerId" serial NOT NULL,
	"channelId" TEXT NOT NULL UNIQUE,
	"displayName" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"profileImgUrl" TEXT NOT NULL,
	"recentVideo" TEXT NOT NULL,
	"isTwitch" BOOLEAN NOT NULL,
	"twitchId" TEXT,
	"isLive" BOOLEAN NOT NULL,
	"lastUpdated" TIMESTAMP NOT NULL default now(),
	"videoUpdated" TIMESTAMP NOT NULL default '2000-01-01 00:00:00',
	CONSTRAINT "streamers_pk" PRIMARY KEY ("streamerId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "likes" (
	"userId" integer NOT NULL,
	"streamerId" integer NOT NULL,
	CONSTRAINT "likes_pk" PRIMARY KEY ("userId","streamerId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "favorites" (
	"userId" integer NOT NULL,
	"streamerId" integer NOT NULL,
	CONSTRAINT "favorites_pk" PRIMARY KEY ("userId","streamerId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("streamerId") REFERENCES "streamers"("streamerId");

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk1" FOREIGN KEY ("streamerId") REFERENCES "streamers"("streamerId");
