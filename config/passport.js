import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../index.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { username: username }});

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log('user successfully authenticated');
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: id }});

    done(null, user);
  } catch(err) {
    done(err);
  }
});

export default passport;