// deno-lint-ignore-file
import type { User, UserForCreation, UserForUpdate } from "../types/user.ts";
import { v1 } from "../deps.ts";

let users: User[] = [{
  uuid:"7faf7eb0-83cf-11ed-9356-e5df468acd8b",
  name:"tomas",
  birthDate:"cumpleaños",

}];

export const findUserById = (uuid: string) => {

    const id =uuid
    const user = users.find( e => e.uuid == id)
  

  if (!user) {
    throw new Error("User not found");
  } else {
    return {
      uuid:user.uuid,
      name :user.name,
      birthDate : user.birthDate,
    };
  }
};

export const createUser = (user:any) => {

    users.push({
      uuid: v1.generate().toString(),
      name: user.name,
      birthDate: user.birthDate,
    })
   
    return {
      uuid: v1.generate().toString(),
      name: user.name,
      birthDate: user.birthDate,
    };
 
};

// updateUser
export const updateUser = (
  uuid: string,
  userForUpdate: UserForUpdate
): User => {
  
let user  = users.find(e => e.uuid = uuid)

  if (!user) {
    throw new Error("user dont exist");
  } else {
    user = {...user , name:JSON.stringify(userForUpdate.name) , birthDate:JSON.stringify(userForUpdate.birthDate)}
    console.log(user)
    return {
      uuid: user.uuid,
      name: user.name,
      birthDate: user.birthDate
    };
  }
};

// deleteUser
export const deleteUser = (uuid: string) => {
    console.log(users)
  if (!users.find(e=>e.uuid == uuid)) {
    throw new Error("canot delete the user because doesn't exist");
  } else {
    users = users.filter(e=>e.uuid !== uuid)
    return {users};
  }
};
