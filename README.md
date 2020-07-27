Mendix Styling Sync
===

> Work on your Mac, sync the theme folder with Windows.

My VSCode works better on my Mac than in the Parallels virtual machine. So... I created a little script that will sync the folders in between

## How To

### Prerequisites

- Download the **release.zip** from the [latest release](https://github.com/JelteMX/mendix-styling-sync/releases/latest).
- Unzip this in a folder on your Mac. Let's say in `/Users/Jelte/ProjectStyling/Project1`
- Make sure you have Node.js (version 12.x or higher) installed. Easiest way is to use [NVM](https://github.com/nvm-sh/nvm)
- Open the folder in a terminal
- Run `npm install`
- Create a file called `.env` in your styling folder (like the folder I created above)
- Add the following like to your file:

```text
THEME_PATH="/Path/From/My/Mac/To/My_Mendix_Project_root"
```

Make sure you can reach this path from your Mac terminal.

- That's it, you're done

### How to use

- Make sure you have updated your Mendix project (Version Control -> Update) in case you have this project on Sprintr
- In the terminal you opened, type `npm start` and hit **Enter**
- The following will happen:

1. It will remove any `theme` folder in your current folder
2. Copy the `theme` folder from your Mendix project to your local folder
3. Keep the local folder in sync with the theme folder in your Mendix project

- Every time you start your project, make sure the sync is stopped (you can Ctrl+C to quit) and you run Update in Mendix. Also, if you are updating your project (for example, your colleague made changes), stop the sync first. It might do well, but I am not sure if it will play nicely, so it's best to quit the sync first.


## Warning

Although the sync should do fine, it's always best to either have a backup locally, or on Sprintr, just in case. You are warned and I take no responsibility if this goes wrong.

## License

The MIT License (MIT)

Copyright (c) 2020 Jelte Lagendijk

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
