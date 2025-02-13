import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import { useToast } from '../../services/toast';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
  const { user, updateProfile, getUserProfile, updateUserProfile } = useAuth();
  const { ToastComponent, showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    phone: '',
    organization: '',
    job_title: '',
    bio: '',
    notification_preferences: {
      email: true,
      push: true
    },
    theme_preference: 'light'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { profile: userProfile, error } = await getUserProfile();
      if (error) throw error;
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      showError('Error', 'Failed to load profile');
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (type) => {
    setProfile(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [type]: !prev.notification_preferences[type]
      }
    }));
  };

  const handleThemeToggle = () => {
    const newTheme = profile.theme_preference === 'light' ? 'dark' : 'light';
    setProfile(prev => ({
      ...prev,
      theme_preference: newTheme
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update auth user metadata
      const { error: authError } = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name
      });
      if (authError) throw authError;

      // Update profile data
      const { error: profileError } = await updateUserProfile(profile);
      if (profileError) throw profileError;

      showSuccess('Success', 'Profile updated successfully');
    } catch (error) {
      showError('Error', error.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.files[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${data.path}`;
      setProfile(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));

      showSuccess('Success', 'Avatar uploaded successfully');
    } catch (error) {
      showError('Error', 'Failed to upload avatar');
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <div className="p-4">
      <ToastComponent />
      
      <Card title="Profile Settings" className="mb-4">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="grid">
            <div className="col-12 md:col-6 mb-4">
              <span className="p-float-label">
                <InputText
                  id="first_name"
                  name="first_name"
                  value={profile.first_name || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="first_name">First Name</label>
              </span>
            </div>

            <div className="col-12 md:col-6 mb-4">
              <span className="p-float-label">
                <InputText
                  id="last_name"
                  name="last_name"
                  value={profile.last_name || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="last_name">Last Name</label>
              </span>
            </div>

            <div className="col-12 mb-4">
              <span className="p-float-label">
                <InputText
                  id="phone"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="phone">Phone Number</label>
              </span>
            </div>

            <div className="col-12 mb-4">
              <span className="p-float-label">
                <InputText
                  id="organization"
                  name="organization"
                  value={profile.organization || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="organization">Organization</label>
              </span>
            </div>

            <div className="col-12 mb-4">
              <span className="p-float-label">
                <InputText
                  id="job_title"
                  name="job_title"
                  value={profile.job_title || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="job_title">Job Title</label>
              </span>
            </div>

            <div className="col-12 mb-4">
              <span className="p-float-label">
                <InputTextarea
                  id="bio"
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleInputChange}
                  rows={5}
                />
                <label htmlFor="bio">Bio</label>
              </span>
            </div>

            <div className="col-12 mb-4">
              <h5>Avatar</h5>
              <FileUpload
                mode="basic"
                name="avatar"
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                uploadHandler={handleAvatarUpload}
                auto
                chooseLabel="Upload Avatar"
              />
            </div>

            <div className="col-12 mb-4">
              <h5>Notification Preferences</h5>
              <div className="flex flex-wrap gap-4">
                <ToggleButton
                  checked={profile.notification_preferences.email}
                  onChange={() => handleNotificationToggle('email')}
                  onLabel="Email Notifications On"
                  offLabel="Email Notifications Off"
                />
                <ToggleButton
                  checked={profile.notification_preferences.push}
                  onChange={() => handleNotificationToggle('push')}
                  onLabel="Push Notifications On"
                  offLabel="Push Notifications Off"
                />
              </div>
            </div>

            <div className="col-12 mb-4">
              <h5>Theme Preference</h5>
              <ToggleButton
                checked={profile.theme_preference === 'dark'}
                onChange={handleThemeToggle}
                onLabel="Dark Theme"
                offLabel="Light Theme"
              />
            </div>
          </div>

          <Button
            type="submit"
            label="Save Changes"
            icon="pi pi-save"
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;
