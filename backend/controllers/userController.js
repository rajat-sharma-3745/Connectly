import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler, errorHandler } from "../utils/handler.js";
import { getDataUri } from "../utils/feature.js";
import { cloudinary } from "../utils/cloudinary.js";
import { Subscription } from "../models/Subscription.js";
import { Post } from "../models/Post.js";
import { Like } from "../models/Like.js";


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        return next(new errorHandler('All fields are required', 400));
    }
    let user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (user) {
        return next(new errorHandler('User already exists', 401))
    }

    await User.create({ username, password, email, })
    return res.status(200).json({
        success: true,
        message: 'Account created successfully'
    })

})


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        return next(new errorHandler('All fields are required', 400));
    }
    let user = await User.findOne({ email }).populate('posts');
    if (!user) {
        return next(new errorHandler('Invalid credentials', 401));
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new errorHandler('Invalid credentials', 401));

    }
    const token = generateToken(user._id);
    // This is one way of manually populating post 
    // const populatedPost = await Promise.all(user.posts.map(async(postId)=>{
    //     const post = await Post.findById(postId);
    //     if(post.author.equals(user._id)) return post;
    // }))

    // 2nd way
    const populatedPost = user.posts.filter((post) => post.author.equals(user._id));
    const userWithoutPassword = user.toObject();
    userWithoutPassword.posts = populatedPost;
    delete userWithoutPassword.password



    return res.cookie('instaToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 24 * 60 * 1000
    }).status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: userWithoutPassword
    })

})

export const logout = asyncHandler(async (req, res) => {
    return res.status(200).cookie('instaToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0
    }).json({
        success: true,
        message: 'Logged out successfully',
    })
})


export const getUser = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    let user = await User.findById(userId).select('-password');
    const followers = await Subscription.find({ channel: userId });
    const followings = await Subscription.find({ subscriber: userId });
    const userObj = user.toObject()
    return res.status(200).json({
        success: true,
        user: {
            ...userObj,
            followers,
            followings,
            followerCount: followers.length,
            followingCount: followings.length,
        }
    })
})
export const getProfile = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({ path: 'posts', sort: { createdAt: -1 } }).populate('bookmarks').select('-password');
    let followers = await Subscription.find({ channel: userId });
    const followings = await Subscription.find({ subscriber: userId });
    const userObj = user.toObject()
    const postIds = user.posts.map((post) => post._id);

    const likes = await Like.find({ post: { $in: postIds } }).select('post likedBy');

    const likesMap = {}

    likes.forEach(like=>{
        const postId = like.post.toString();
        const UserId = like.likedBy.toString();
        if(!likesMap[postId]) likesMap[postId] = [];
        likesMap[postId].push(UserId);
    })
    const postWithLikes = user.posts.map((post)=>{
        const postObj = post.toObject();
        postObj.likes = likesMap[post._id.toString()] || []
        return postObj;
    })

    let followersWithIds=followers.map((i)=>i.subscriber.toString());

    return res.status(200).json({
        success: true,
        user: {
            ...userObj,
            posts:postWithLikes,
            followers:followersWithIds,
            followings:followings.map((i)=>i.channel),
            followerCount:followers.length || 0,
            followingCount: followings.length || 0,
            isFollowing:followersWithIds.includes(req.userId.toString())
        }
    })
})


export const editProfile = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');
    if (!user) return next(new errorHandler('User not found', 404));
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;



    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile updated",
        user
    })

})


export const getSuggestedUser = asyncHandler(async (req, res, next) => {
    const suggestedUser = await User.find({ _id: { $ne: req.userId } }).select('-password');
    if (!suggestedUser) return res.status(300).json({
        message: 'No users'
    })
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users: suggestedUser
    })
})


export const followOrUnfollow = asyncHandler(async (req, res, next) => {
    const subscriber = req.userId;
    const channel = req.params.id;

    const user = await User.findById(subscriber);
    const targetUser = await User.findById(channel);
    if (!user || !targetUser) {
        return next(new errorHandler('User not found', 404))
    }

    let subscription = await Subscription.findOne({ subscriber, channel });
    if (subscription) {
        await subscription.deleteOne();
        return res.status(200).json({
            message: "Unfollowed successfuly",
            success: true
        })
    } else {
        await Subscription.create({ subscriber, channel });
        return res.status(200).json({
            message: "Followed successfuly",
            success: true
        })
    }

})