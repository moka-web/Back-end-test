// deno-lint-ignore-file
import { Context, helpers } from "../deps.ts";
import type { User } from "../types/user.ts";
import * as db from "../db/user.ts";

export const findUser =(ctx: Context) => {
  const { userId } = helpers.getQuery(ctx, { mergeParams: true });

  console.log(userId)

  try {
    const user: User = db.findUserById(userId);
    ctx.response.body = user;
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.body = { msg: err.message };
  }
};

export const createUser = async (ctx: Context) => {
  try {
    const { name, birthDate } = await ctx.request.body().value;
    const createdUser: User = db.createUser({
      name,
      birthDate /* convertirlo a fecha*/,
    });
    ctx.response.body = createdUser;
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { msg: err.message };
  }
};


export const updateUser = async (ctx: Context) => {
  const { userId } = helpers.getQuery(ctx, { mergeParams: true });
  const { name, birthDate } = await ctx.request.body().value;

  try {
    const updatedUser = db.updateUser(userId,{name,birthDate})
    ctx.response.body = updatedUser;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { msg: error.message };
  }

};

export const deleteUser = async (ctx: Context) => {
  const { userId } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    const deletedUser = db.deleteUser(userId);
    ctx.response.body = deletedUser
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { msg: error.message };
  }
};
