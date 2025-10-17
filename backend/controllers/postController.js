import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { Post } from "../models/Post.js";
import { Subscription } from "../models/Subscription.js";
import { User } from "../models/User.js";
import { io, userSocketMap } from "../socket/socket.js";
import { cloudinary } from "../utils/cloudinary.js";
import { asyncHandler, errorHandler } from "../utils/handler.js";
import sharp from 'sharp'

export const addNewPost = asyncHandler(async (req, res, next) => {
    const { caption } = req.body;
    const image = req.file;
    const author = req.userId;

    if (!image) return next(new errorHandler('Image required', 400))
    const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({ caption, image: cloudResponse.secure_url, author });

    const user = await User.findById(author);
    if (user) {
        user.posts.push(post._id);
        await user.save();
    }
    await post.populate('author', '-password');
    return res.status(200).json({
        message: "New post added",
        success: true,
        post
    })
})


export const getAllPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author', 'username profilePicture').populate({
        path: 'comments', sort: { createdAt: -1 }, populate: {
            path: 'author', select: 'username profilePicture'
        }
    })
    
    
    // Find post ids 
    const postIds = posts.map(post => post._id); // we can fetch and count the likes for each post here itself by making the callback async and wrapping it inside the promise.all , but for multiple post , there will be multiple queries which can be inefficient for large number of posts
    const authorIds = posts.map(post => post.author._id);
    let followers = await Subscription.find({ channel:{$in:authorIds}  });
    const followerMap = {};
    followers.forEach(follower=>{
        const subscriber = follower.subscriber.toString();
        const channel = follower.channel.toString();
        if(!followerMap[channel]) followerMap[channel]=[]
        followerMap[channel].push(subscriber);
    })
    // Fetch all the likes for these posts
    const likes = await Like.find({ post: { $in: postIds } }).select('post likedBy'); //in operator is used to select those documents where the field value matches any of the values in array , each like document contains post (refrence) ,and we are fetching all those documents where the post field matches any of the ids in array
    
    const likesMap = {}
    // Map each post with its like count through post id, this is only for like count
    // likes.forEach(like=>{
    //     const postId = like.post.toString();
    //     if(!likesMap[postId]) likesMap[postId] = 0
    //     likesMap[postId]++;
    // })

    // bcoz we want an array of user ids  who liked the post ,so instead mapping each post id to its like count we will map each post id to an array of userIds
    likes.forEach(like => {
        const postId = like.post.toString();
        const userId = like.likedBy.toString();
        if (!likesMap[postId]) likesMap[postId] = []
        likesMap[postId].push(userId);
    })

    const postWithLikes = posts.map((post) => {
        const postObj = post.toObject();
        const followers = followerMap[post.author._id.toString()] || [];
        postObj.likes = likesMap[post._id.toString()] || [];
        postObj.author.followers = followers
        postObj.author.isFollowing = followers.includes(req.userId.toString())
        return postObj;
    })


    return res.status(200).json({
        success: true,
        posts: postWithLikes
    })
})


export const getUserPost = asyncHandler(async (req, res, next) => {
    const authorId = req.userId;
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate('author', 'username profilePicture').populate({
        path: 'comments', sort: { createdAt: -1 }, populate: {
            path: 'author', select: 'username profilePicture'
        }
    });
    return res.status(200).json({
        success: true,
        posts
    })
})

export const likePost = asyncHandler(async (req, res, next) => {
    const likedBy = req.userId;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }
    const alreadyLiked = await Like.findOne({ likedBy, post: postId });
    if (alreadyLiked) {
        return next(new errorHandler('Already liked', 300));
    }
    await Like.create({ likedBy, post: postId });

    // socket
    const user = await User.findById(likedBy).select('username profilePicture');
    const authorId = post.author.toString()
    if (authorId !== likedBy) {
        const notification = {
            type: 'like',
            userId: likedBy,
            userDetails: user,
            postId,
            message: "Your post was liked",

        }
        const authorSocketId = userSocketMap.get(authorId);
        io.to(authorSocketId).emit('notification', notification)
    }



    return res.status(200).json({
        message: "Post liked",
        success: true
    })
})

export const dislikePost = asyncHandler(async (req, res, next) => {
    const likedBy = req.userId;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }
    const like = await Like.findOne({ likedBy, post: postId });
    if (like) {
        await like.deleteOne();

    }

    // socket
    const user = await User.findById(likedBy).select('username profilePicture');
    const authorId = post.author.toString()
    if (authorId !== likedBy) {
        const notification = {
            type: 'dislike',
            userId: likedBy,
            userDetails: user,
            postId,
            message: "Your post was disliked",

        }
        const authorSocketId = userSocketMap.get(authorId);
        io.to(authorSocketId).emit('notification', notification)
    }


    return res.status(200).json({
        message: "Post disliked",
        success: true
    })
})

export const addComment = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const commenterId = req.userId;
    const { text } = req.body;
    if (!text) {
        return next(new errorHandler('Text is required', 404));
    }
    const post = await Post.findById(postId);
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }
    const comment = await Comment.create({ text, post: postId, author: commenterId })
    await comment.populate('author', 'username profilePicture');

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
        message: "Comment added",
        comment,
        success: true
    })

})


export const getPostComments = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
    if (!comments || comments.length < 1) {
        return next(new errorHandler('No comments', 404));
    }
    return res.status(200).json({
        comments,
        success: true
    })

})


export const deletePost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const authorId = req.userId
    const post = await Post.findById(postId);
    if (!post) {
        return next(new errorHandler('Post not found', 404))
    }
    if (post.author.toString() !== authorId) return next(new errorHandler('Not authorised', 401));

    await post.deleteOne();
    const user = await User.findById(authorId);
    user.posts = user.posts.filter((post) => post.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });
    return res.status(200).json({
        message: 'Post deleted',
        success: true
    })
})


export const bookmarkPost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const authorId = req.userId
    const [post, user] = await Promise.all([Post.findById(postId), User.findById(authorId)]);
    if (!post) {
        return next(new errorHandler('Post not found', 404))
    }
    if (!user) return next(new errorHandler('User not found', 404));

    if (user.bookmarks.includes(post._id)) {
        await user.updateOne({ $pull: { bookmarks: post._id } })
        await user.save();
        return res.status(200).json({
            type: 'unsaved',
            message: 'Post removed from bookmark',
            success: true
        })
    } else {
        await user.updateOne({ $addToSet: { bookmarks: post._id } })
        await user.save();
        return res.status(200).json({
            type: 'saved',
            message: 'Post added into bookmark',
            success: true
        })
    }
})