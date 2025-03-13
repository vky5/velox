import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
clsx is a utility which helps us to merge tailwind classes and handle logic that I used to do with ${} and twMerge
is used to resolve tailwind conflicts

const className = clsx("btn", isPrimary && "btn-primary", isDisabled && "btn-disabled");



import { twMerge } from "tailwind-merge";

const className = twMerge(clsx("text-red-500", "text-blue-500")); 

otherwise there wuld be conflict
console.log(className); // "text-blue-500"

only last class is kept
*/
