SaloneBiz Create Post JWT Fix

Replace:
js/pages/create.js

The old file checked Supabase Auth with:
supabase.auth.getSession()

The fixed file uses the existing SaloneBiz JWT:
localStorage["salonebiz_token"]
or localStorage["salonebiz_user"].token

createPost() from api.js then sends the JWT to:
https://salonebiz-backend.onrender.com/api/posts

Supabase is used only for Storage image upload.

IMPORTANT:
The Supabase "posts" bucket must allow the intended browser upload through its Storage policies. If publishing reaches Supabase and reports a permission/RLS error, the Storage policy needs to be fixed next.
