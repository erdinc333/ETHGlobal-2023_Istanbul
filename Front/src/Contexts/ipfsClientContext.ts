import { Client } from "@web3-storage/w3up-client";
import { createContext } from "react";

export const IpfsClientContext = createContext<Client | null>(null)