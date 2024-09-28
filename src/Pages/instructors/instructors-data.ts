import { InstructorType } from "../../types/instructors";

export const instructors: InstructorType[] = [
  {
    id: 1,
    email: "user@email.com",
    first_name: "John",
    last_name: "Doe",
    password: "password",
    phone_number: "+2348181114416",
    role: "lecturer",
    courses: [
      { id: 1, instructor: "Instructor 1", name: "course 1" },
      { id: 2, instructor: "Instructor 1", name: "course 2" },
      { id: 3, instructor: "Instructor 1", name: "course 3" },
    ],
  },
  {
    id: 2,
    email: "user@email.com",
    first_name: "John",
    last_name: "Doe",
    password: "password",
    phone_number: "+2348181114416",
    role: "lecturer",
    courses: [
      { id: 1, instructor: "Instructor 1", name: "course 1" },
      { id: 2, instructor: "Instructor 1", name: "course 2" },
      { id: 3, instructor: "Instructor 1", name: "course 3" },
    ],
  },
  {
    id: 3,
    email: "user@email.com",
    first_name: "John",
    last_name: "Doe",
    password: "password",
    phone_number: "+2348181114416",
    role: "lecturer",
    courses: [
      { id: 1, instructor: "Instructor 1", name: "course 1" },
      { id: 2, instructor: "Instructor 1", name: "course 2" },
      { id: 3, instructor: "Instructor 1", name: "course 3" },
    ],
  },
];
