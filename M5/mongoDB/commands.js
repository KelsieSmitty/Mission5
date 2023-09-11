#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { addCar, findCar, updateCar, removeCar, listCars } from "./index.js";

const { prompt } = inquirer;
const program = new Command();

// Car Questions
const questions = [
  {
    type: "input",
    name: "body",
    message: "Body Type",
  },

  {
    type: "input",
    name: "make",
    message: "Car Make",
  },
  {
    type: "input",
    name: "model",
    message: "Car Model",
  },
  {
    type: "input",
    name: "color",
    message: "Car Color",
  },
  {
    type: "input",
    name: "year",
    message: "Car Year",
  },
  {
    type: "input",
    name: "price",
    message: "Car Price",
  },
  {
    type: "input",
    name: "image",
    message: "Car Image URL",
  },
];

program.version("1.0.0").description("Car Management System");

// Add command
program
  .command("add")
  .alias("a")
  .description("Add a Car")
  .action(() => {
    prompt(questions).then((answers) => {
      addCar(answers);
    });
  });

// Find command
program
  .command("find <name>")
  .alias("f")
  .description("Find a Car")
  .action((name) => findCar(name));

// Update command
program
  .command("update <_id>")
  .alias("u")
  .description("Update a Car")
  .action((_id) => {
    prompt(questions).then((answers) => updateCar(_id, answers));
  });

// Remove command
program
  .command("remove <_id>")
  .alias("r")
  .description("Remove a Car")
  .action((_id) => removeCar(_id));

// List All command
program
  .command("list")
  .alias("l")
  .description("List all cars")
  .action(() => listCars());

program.parse(process.argv);
