import { ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
import moment from "moment";

export function strCheck(strVal, varName) {
  if (!strVal)
    throw new GraphQLError(`Error: You must supply a ${varName}!`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (typeof strVal !== "string")
    throw new GraphQLError(`Error: ${varName} must be a string!`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw new GraphQLError(
      `Error: ${varName} cannot be an empty string or string with just spaces`,
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  return strVal;
}

export const validateName = (str) => {
  str = strCheck(str, "Name");
  const regex = /^[A-Za-z]+$/;
  if (!regex.test(str)) {
    throw new GraphQLError("Name must only contain letters", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return str;
};

export const isValidId = (id) => {
  if (!id)
    throw new GraphQLError("You must provide an id to search for", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (typeof id !== "string")
    throw new GraphQLError("Id must be a string", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (id.trim().length === 0)
    throw new GraphQLError("Id cannot be an empty string or just spaces", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  id = id.trim();
  if (!ObjectId.isValid(id))
    throw new GraphQLError("Invalid object ID", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  return id;
};

export const isValidInt = (num, varName) => {
  if (!num)
    throw new GraphQLError(`You must provide a ${varName}`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (typeof num !== "number" || !Number.isInteger(num))
    throw new GraphQLError(`${varName} must be an integer`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
};

export const isValidDate = (date, varName) => {
  if (!date)
    throw new GraphQLError(`You must provide a ${varName}`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (typeof date !== "string")
    throw new GraphQLError(`${varName} must be a string`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  date = date.trim();
  if (date.length === 0)
    throw new GraphQLError(
      `${varName} cannot be an empty string or just spaces`,
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  const dateFormats = ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY"];
  if (!moment(date, dateFormats, true).isValid()) {
    throw new GraphQLError(`Invalid ${varName} format`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (moment(date, dateFormats, true).isAfter(moment())) {
    throw new GraphQLError(`Invalid ${varName} since its a futute date`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return date;
};
