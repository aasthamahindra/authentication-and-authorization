require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { blogModel } = require('./db/models/blogs.model');
const { userModel } = require('./db/models/users.model');

const resolvers = {
    Query: {
        getBlogPosts: async () => {
            const blogs = await blogModel.find({})
            return {
                nodes: blogs,
                aggregate: {
                    count: blogs.length
                },
            }
        },

        getBlogPost: async (parent, args, context, info) => {
            const { genre } = args;
            const blog = await blogModel.findOne({ genre });
            return blog; 
        },

        getUsers: async () => {
            const user = await userModel.find({});
            return user;
        },

        getUser: async (parent, args, context, info) => {
            const { email } = args;
            const user = await userModel.findOne({ email });
            if(!user) {
                return { error: "User doesn't exist!"};
            } else {
                return user;
            }
        }
    },

    Mutation: {
        addBlogPost: async (parent, args, context, info) => {
            const { title, body, postImage, genre } = args;

            const { id } = context.user;
            const user = await userModel.findOne({ _id: Object(id) });
            
            const role = user.role;
            if (role !== "admin" && role !== "editor")
            return {
                error: "You have no permission to perform this action",
            };

            const blogPost = new blogModel({
                title,
                body,
                genre,
                postImage,
            });
            blogPost.save();
            return blogPost;
        },

        signIn: async (parent, args, context, info) => {
            const { email, password } = args;
            const user = await userModel.findOne({ email });

            // if no user is found
            if (!user) {
                return { error: "User doesn't exist! Please sign up." }
            } else {
                // check password: if it doesn't match throw authentication error
                const validate = await bcrypt.compare(password, user.password).then((result) => {
                    return result;
                }).catch(e => { return { error: e} } );
                if (!validate) {
                    return { error: "Password doesn't match!" };
                } else {
                    return {
                        token: jwt.sign(
                            { id: user._id },
                            process.env.SECRET,
                        )
                    }
                }
            }
        },

        signUp: async (parent, args, context, info) => {
            const { email, password, username } = args;
            let { role } = args;
            const existingUser = await userModel.findOne({ email });

            if (existingUser) {
                return { error: 'User already exists! Please sign in.'};
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);

                if (!role) {
                    role = 'reader';
                }
                
                const user = new userModel({
                    email,
                    username,
                    role,
                    password: hashPassword
                });
                user.save();
                return {
                    message: 'User created successfully',
                    user,
                    token: jwt.sign(
                        { id: user._id },
                        process.env.SECRET,
                    )
                }
            }
        },
    }
};

module.exports = { resolvers };