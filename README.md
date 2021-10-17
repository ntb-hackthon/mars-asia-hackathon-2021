# mars-asia-hackathon-2021

## Team

* name: NTB
* github: <https://github.com/NftTopBest>
* email: nfttop.best@gmail.com

## [Video](./demo.mov)

## What is it?

It's a `discord NFT minter`, that discord Guild owner can setup it to mint new NFT through the Channel

For the special NFT, NFT seller can setup a huddle01 video chat meeting for it, user can join the video chatting room to have video
chat with owner.

## How it work?

1. It use the Pinata service to upload file to IPFS.
2. It use the discord's `splash` command feature that user can submit their pinata private key in the discord channle without public.
3. user can use `~upload [fileName]` to upload file to IPFS
4. Guild owner can turn the huddle01 video chat that provide every new created channel to have the video chat function to their user automaticly.

## Features

*Guild member*

1. setup pinata private key by `/pinata` splash cmd
2. get pinata config by `/pinata-config` splash cmd
3. upload file to IPFS in discrod

*Guild Admin*

1. setup huddle01 video chat for each channel
2. setup it's private key for the bot to mint NFT for the guild member(with specific role)
3. setup user to specific role to have mint NFT feature

## code link

<https://github.com/ntb-hackthon/mars-asia-hackathon-2021>

As the bot maybe develop as a SaaS later then so for now we do not public all the discord bot
code, we just share the code for the [pinata](./pinata.js)

## online Demo

Your can try it by two methods.

1. access the discord channel direct: <https://discord.gg/mqBksZ9qtz>
2. invite the bot into your own guild, invite link: <https://discord.com/api/oauth2/authorize?client_id=892688696967593995&permissions=8&scope=bot%20applications.commands>
