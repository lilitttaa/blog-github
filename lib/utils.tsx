export const Name2Id = (Name: string) => {
  return Name.replace(/ /g, '-').toLowerCase()
}

export const getImageUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return ''
    }
    return '/blog-github'
}