const axios = require('axios').default

const CONFIG = {
  owner: process.env.REPO_OWNER,
  token: process.env.REPO_TOKEN,
  repo: process.env.REPO_NAME,
  filename: process.env.REPO_FILENAME,
  branch: process.env.REPO_BRANCH,
  domain_url: 'https://api.github.com',
  resource_url: '/repos/:owner/:repo/contents/:filename',
  method: 'PUT',
  data: {
    branch: '',
    message: 'New content on the database',
    content: '',
    sha: ''
  }
}

const instance = axios.create({
  baseURL: CONFIG.domain_url
})
instance.defaults.headers.common.Authorization = `token ${CONFIG.token}`

async function getContents () {
  try {
    const response = await instance.get(
      `${CONFIG.resource_url
        .replace(':owner', CONFIG.owner)
        .replace(':repo', CONFIG.repo)
        .replace(':filename', CONFIG.filename)}?ref=${CONFIG.branch}`
    )

    return response.data
  } catch (e) {
    console.log(module.filename)
    console.log(`Error getting contents: ${e.message}`)

    return {}
  }
}

async function updateContents (contentBase64, fileContentSHA) {
  try {
    const response = await instance({
      method: CONFIG.method,
      url: `${CONFIG.resource_url
        .replace(':owner', CONFIG.owner)
        .replace(':repo', CONFIG.repo)
        .replace(':filename', CONFIG.filename)}`,
      data: Object.assign(CONFIG.data, {
        branch: CONFIG.branch,
        content: contentBase64,
        sha: fileContentSHA
      })
    })

    return response.status === 200
  } catch (e) {
    console.log(module.filename)
    console.log(`Error updating contents: ${e.message}`)

    return false
  }
}

module.exports = async () => {
  // Get file SHA
  const fileContents = await getContents()

  // Create encoded content
  const data = `last updated content: ${new Date().toUTCString()}`
  const buffer = Buffer.from(data)
  const encodedContent = buffer.toString('base64')

  // Update github repo file
  await updateContents(encodedContent, fileContents.sha)
}
