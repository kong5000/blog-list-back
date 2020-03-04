const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const getTotalLikesFromBlogs = (total, blog) => {
        return total + blog.likes
    }
    const total = blogs.reduce(getTotalLikesFromBlogs, 0)
    return(total)
}
module.exports = {
    dummy,
    totalLikes
}