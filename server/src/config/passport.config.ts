import type { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Env } from "./env.config";
import { User } from "@/models/user.model";
import { toAuthUser } from "@/repositories/auth.repository";

const cookieExtrator = (req: Request) => req?.cookies?.access_token ?? null;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtrator]),
      secretOrKey: Env.JWT_SECRET,
    },
    async (payload: { sub: string }, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        return done(null, toAuthUser(user));
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

if (Env.GOOGLE_CLIENT_ID && Env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
        callbackURL: Env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email)
            return done(null, false, {
              message: "No email found in Google profile",
            });

          const existing = await User.findOne({ email });
          if (existing) {
            if (!existing.googleId) {
              existing.googleId = profile.id;
              existing.emailVerified = new Date();
              await existing.save();
            }
            return done(null, toAuthUser(existing));
          }

          const user = await User.create({
            name: profile.displayName || email,
            email,
            googleId: profile.id,
            avatarUrl: profile.photos?.[0]?.value ?? null,
            emailVerified: new Date(),
          });

          return done(null, toAuthUser(user));
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
}

export default passport;
