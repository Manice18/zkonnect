![zKonnect](https://github.com/Manice18/zkonnect/assets/94488557/6981b424-41d8-4a82-859c-c3889490ae1e)

# zKonnect

zKonnect is a blockchain-based application designed to help creators host their events seamlessly in a decentralized environment. Built on the Solana blockchain, zKonnect leverages the power of decentralization to provide a secure, efficient, and user-friendly platform for event management and ticketing.
It uses **Huddle01SDK** for token-gated rooms and **Reclaim Protocol** to get a zk-proof of the number of followers of a creator.

## Features

- **Decentralized Event Hosting**: Create and manage events on the Solana blockchain.
- **Seamless Payments**: Utilize Solana's fast and low-cost transactions for ticket purchases.
- **In-App Currency**: Use Blinks as an in-app currency for various transactions.
- **cNFT Ticketing**: Provide attendees with unique NFTs as event tickets and memorabilia.
- **Multi-token Payment**: Currently we give options for creators to accept payments in Sol, USDC, and are willing to expand more.
- **Creator Tools**: Comprehensive tools for event creation, management, and analytics.
- **Audience Engagement**: Interactive features to enhance the event experience for attendees.
- **AI Integration** : We aim to provide fastest possible event organization experience to the user with AI chatbot to extract event data from the user's chat to directly create an event.

## Technology Stack

- Built on Solana
- In-App Currency: Blinks
- NFT Standard: Solana NFT standard (Metaplex)
- Next.js
- DialogflowCX

## What's new with Blinks?

- [Blockchain links](https://solana.com/docs/advanced/actions#blinks) – or blinks – turn any Solana Action into a shareable, metadata-rich link. Blinks allow Action-aware clients (browser extension wallets, bots) to display additional capabilities for the user. On a website, a blink might immediately trigger a transaction preview in a wallet without going to a decentralized app;
  ![Blinks](https://github.com/Manice18/zkonnect/assets/94488557/51382f68-0ec8-47f9-adb3-2c12a2be688a)

### Figma

- [Figma Link](https://www.figma.com/proto/pPGLD4TiGBRdhMnILmF93e/zKonnect?node-id=1-629&t=Nbt3tm2QqEiG1WmA-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

### YouTube

- [YouTube](https://youtu.be/qprTSTpP9zQ)

### Blink Working proof:

- https://dial.to/?action=solana-action:https://zkonnect.vercel.app/api/actions/support?eventName=An%20online%20event&address=8SxxZLiRpQT4WAk4kg1VyfbEvraKJj6DamfZJJoMQtKG
  <img width="548" alt="image" src="https://github.com/user-attachments/assets/8abef5d7-d378-48ec-a45b-5edea23d284a">

### Prerequisites

- [Solana CLI Tools](https://docs.solana.com/cli/install-solana-cli-tools)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository
2. Run the command `npm i`.
3. copy the env variables from .env.example and paste into .env
4. Go to [Huddle](https://docs.huddle01.com/docs/api-keys) and get you API_KEY and Project Id and paste under NEXT_PUBLIC_PROJECT_ID AND API_KEY.
5. Go to [Reclaim](https://dev.reclaimprotocol.org/) and create your app by select the linkedin equal provider and paste the keys under RECLAIM_APP_ID and RECLAIM_SECRET_KEY respectively.
6. Put NEXT_PUBLIC_ENVIRONMENT value as localhost.
7. Get the DATABASE_URL by creating a db from MongoDB.
8. Get your Pinata_JWT from Pinata Cloud.
9. Get a account whole private key can be used for NFT creating and put it under NFT_SIGNER_PVT_KEY, make sure it has enough SOL.
10. Grab your NEXT_PUBLIC_SOLANA_RPC url from your choice of RPC provider and put the value, or the default solana rpc will be used (I'll suggest get one from [Heilus](https://www.helius.dev/)).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
