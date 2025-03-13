"use strict";
const asyncHandler = (fnc) => {
  return (req, res, next) => {
    fnc(req, res, next).catch(next);
  };
};

module.exports = asyncHandler;
