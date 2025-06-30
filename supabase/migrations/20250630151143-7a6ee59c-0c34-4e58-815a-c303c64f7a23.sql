
-- Add unique constraint for user_layout_settings table
-- This constraint is needed for the upsert operation in the layout settings
ALTER TABLE user_layout_settings 
ADD CONSTRAINT user_layout_settings_user_device_unique 
UNIQUE (user_id, device_type);
