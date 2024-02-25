if(!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis respository must using as the package manager` +
    ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1)
}