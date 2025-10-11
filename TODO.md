# TODO for Profile Navigation on Post Avatar Click

## Steps:
make the backbutton from my own profile page navigate to homepage when clicked


and when backbutton on friend's/other user's page is clicked, it will go back to friend page



- [x] Update the avatar click handler in `src/features/components/postComponent.js`:
  - Remove dependency on `profileContainer`.
  - Dispatch a 'navigate' CustomEvent with `{ page: 'profile', userId: userData.id }`.
  - Add fallback if `userData.id` is missing (navigate to current user's profile).
  - Retain `cursor: pointer` for UX.

- [x] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the navigation in the app (e.g., click avatar in home feed to ensure it routes to the post owner's profile page).

# TODO for Displaying Posts on Profile Page

## Steps:

- [x] Update post fetching logic in `src/features/profile/profile.view.js` to handle both mock friends' posts (from `userData.posts`) and stored posts (from localStorage), sort by date (newest first), and reuse `createPostElement`.

- [ ] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the post display on profile pages (e.g., navigate to a friend's profile and verify their posts show correctly, sorted by date).

# TODO for Scrolling to Top on Profile Navigation from Post Avatar

## Steps:

- [x] Update `src/features/profile/profile.view.js` to scroll to the top of the page when rendering the profile (after `renderView()`).

- [ ] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the navigation from post avatar click to ensure it navigates to profile and scrolls to the top (profile header visible).

# TODO for Improving Edit Profile Page Layout and Design

## Steps:

- [x] Update `src/features/edit-profile/edit-profile.view.js` to organize into sections (Profile Picture, Personal Information, Interests), add avatar change, and include editable name fields.

- [x] Update `src/features/edit-profile/edit-profile.css` to use CSS variables, add section dividers/icons, improve spacing/animations, and enhance modern clean design.

- [x] After edits, update this TODO.md to mark the steps as completed.

- [ ] Followup: Test the edit profile page for organization, functionality (saving changes), responsiveness, and modern design.

# TODO for Consistent Back Button on Profile Pages

## Steps:

- [x] Update `src/features/profile/profile.view.js` to show name beside back button for both own and friends profiles, remove "Profile" label.

- [x] Update `src/app.js` to not show global back button on profile pages, avoiding duplicate back buttons.

- [x] Update back button click handler in `src/features/profile/profile.view.js` to navigate to home for own profile, to friends for others.

- [x] After edits, update this TODO.md to mark the steps as completed.

- [ ] Followup: Test back button on own profile (shows name, navigates to home), friends profile (shows name, navigates to friends, no duplicate).
