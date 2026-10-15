import { DivacastClient } from "./divacast-api";

let idTokenGetter: () => Promise<string | null> = async () => null;

export function setIdTokenGetter(getter: () => Promise<string | null>): void {
  idTokenGetter = getter;
}

export const divacast = new DivacastClient({
  getIdToken: () => idTokenGetter(),
});
