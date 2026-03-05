# Profile Components — Developer Manual

## Quick Orientation

This page contains **one orchestrator** and **8 focused sub-components**.
All state, handlers, and API calls live in the orchestrator (`ProfileComponents.jsx`).
The sub-components _only_ render UI — they never call APIs themselves.

---

## Folder Structure

```
ProfileComponents/
│
│  ProfileComponents.jsx          ← orchestrator (edit this to change logic / state)
│  ProfileComponents.module.css   ← all CSS for every component in this folder
│  profileConstants.js            ← UAE_STATES, ADDRESS_LABELS
│  profileApiUtils.js             ← all API helper functions
│
│  ← root-level .jsx files below are thin re-exports, component code is in _components/
│  ProfilePictureSection.jsx
│  OtpVerificationPopup.jsx
│  PersonalInfoForm.jsx
│  AddressCard.jsx
│
└─ _components/
     ProfilePictureSection.jsx    ← avatar image, upload, remove
     PersonalInfoForm.jsx         ← first/last name, email, phone, gender + edit controls
     OtpVerificationPopup.jsx     ← 4-digit OTP overlay with countdown timer
     AddressCard.jsx              ← single address display with edit/delete icons
     AddressSection.jsx           ← renders all address cards + "Add new Address" button
     AddressFormPopup.jsx         ← shared Add / Edit address popup (mode="add"|"edit")
     DeleteAddressPopup.jsx       ← small confirm-to-delete popup
     DeleteAccountPopup.jsx       ← full delete-account warning popup
```

---

## Component Responsibility Table

| Component | Renders | Gets data from | Talks to API? |
|---|---|---|---|
| `ProfileComponents.jsx` | nothing itself; mounts all children | `initialData` prop + `useSession` | ✅ via profileApiUtils |
| `ProfilePictureSection` | avatar, upload btn, remove btn | props | ❌ |
| `PersonalInfoForm` | all profile fields, Save/Cancel | props | ❌ |
| `OtpVerificationPopup` | 4-digit OTP modal + countdown | props | ❌ |
| `AddressSection` | default card + other cards list | props | ❌ |
| `AddressCard` | one address, edit/delete icons | props | ❌ |
| `AddressFormPopup` | add or edit address form | props | ❌ |
| `DeleteAddressPopup` | cancel / confirm address deletion | props | ❌ |
| `DeleteAccountPopup` | cancel / confirm account deletion | props | ❌ |

---

## Utilities Used

### `validatorFunctions.js` (`@/utils/validatorFunctions`)
| Function | Used for |
|---|---|
| `validateRequired(value, fieldName)` | First name, last name, address street |
| `validateUAEPhone(phone)` | Profile phone, address phone |

### `profileApiUtils.js`
| Function | HTTP call |
|---|---|
| `updateProfileAPI(userId, payload)` | `PATCH /api/users/:id` |
| `saveAddressAPI(userId, addressPayload)` | `PATCH /api/users/:id` with addresses array |
| `deleteAddressAPI(userId, addressId)` | `DELETE /api/users/:id` |
| `checkDeleteAccountAPI()` | `GET /api/website/profile/delete` |
| `confirmDeleteAccountAPI()` | `POST /api/website/profile/delete/confirm` |

---

## Props Reference

### `ProfilePictureSection`
| Prop | Type | Description |
|---|---|---|
| `profileImageUrl` | `string\|null` | Current profile image URL |
| `isGuestUser` | `boolean` | Hides upload/remove for guests |
| `onUpload` | `(base64) => void` | Called after file read |
| `onRemove` | `() => void` | Called on Remove button click |

### `PersonalInfoForm`
| Prop | Type | Description |
|---|---|---|
| `profile` | `object` | `{ firstName, lastName, email, phone, gender }` |
| `editMode` | `boolean` | Whether fields are editable |
| `errors` | `object` | Field error messages |
| `isGuestUser` | `boolean` | Disables all editing |
| `originalEmail` | `string` | The saved email — shows Verify when mismatched |
| `onFieldChange` | `(field, value) => void` | Updates profile state. Use `"__editMode__"` to trigger edit mode |
| `onSave` | `() => void` | Save button handler |
| `onCancel` | `() => void` | Cancel button handler |
| `onVerifyEmail` | `() => void` | Opens OTP popup |
| `showOtpPopup` | `boolean` | Controls whether `otpNode` is visible |
| `otpNode` | `ReactNode` | The `<OtpVerificationPopup>` element to render |

### `OtpVerificationPopup`
| Prop | Type | Description |
|---|---|---|
| `email` | `string` | Email displayed in the message |
| `countdown` | `number` | Seconds left on resend timer |
| `otp` | `string[]` | Array of 4 digit strings |
| `inputRefs` | `ref` | React ref for auto-focus between digits |
| `onChange` | `(e, index) => void` | Digit input handler |
| `onKeyDown` | `(e, index) => void` | Backspace handler |
| `onVerify` | `() => void` | Verify button action |
| `onClose` | `() => void` | Close (×) button action |

### `AddressSection`
| Prop | Type | Description |
|---|---|---|
| `addresses` | `object[]` | Full list of addresses from state |
| `onAddNew` | `() => void` | Opens add address popup |
| `onEdit` | `(address) => void` | Opens pre-filled edit popup |
| `onDeleteRequest` | `(id) => void` | Shows delete confirmation popup |

### `AddressCard`
| Prop | Type | Description |
|---|---|---|
| `address` | `object` | Single address object |
| `onEdit` | `(address) => void` | Pencil icon click |
| `onDelete` | `(id) => void` | Trash icon click |

### `AddressFormPopup`
| Prop | Type | Description |
|---|---|---|
| `mode` | `"add" \| "edit"` | Controls title + save button text |
| `addressForm` | `object` | Current form field values |
| `addressErrors` | `object` | Per-field validation errors |
| `addressGeneralError` | `string` | General error message |
| `activeLabelBtn` | `string` | Which Home/Work/Others button is active |
| `UAE_STATES` | `array` | Pass `UAE_STATES` from `profileConstants` |
| `onFormChange` | `(field, value) => void` | Updates one field |
| `onLabelSelect` | `(label) => void` | Selects Home/Work/Others |
| `onSave` | `() => void` | Save/Update button |
| `onCancel` | `() => void` | Cancel button |

### `DeleteAddressPopup` / `DeleteAccountPopup`
| Prop | Type | Description |
|---|---|---|
| `onConfirm` | `() => void` | Confirms the destructive action |
| `onCancel` / `onKeep` | `() => void` | Dismisses the popup |
| `accountStatus` *(Delete Account only)* | `object\|null` | Shows subscription/order warnings |

---

## Common Tasks

### Add a new field to the profile form
1. Add the field to the `profile` state in `ProfileComponents.jsx`.
2. Add an `<input>` inside `PersonalInfoForm.jsx` with an `onChange` calling `onFieldChange("yourField", value)`.
3. Add validation in `handleSaveProfile` using `validateRequired` or a custom validator.
4. Update the PATCH payload in `handleSaveProfile`.

### Add a new field to the address form
1. Add the `<input>` inside `AddressFormPopup.jsx`.
2. Call `onFormChange("yourField", value)` on change — the parent handles state.
3. Add validation in `handleSaveAddress` inside `ProfileComponents.jsx`.
4. Include the field in the `payload` array inside `handleSaveAddress`.

### Add a new API call
1. Write the function in `profileApiUtils.js` — it should return `{ success, data?, error? }`.
2. Import and call it from `ProfileComponents.jsx` in the appropriate handler.

---

## OTP Wiring (TODO)
`OtpVerificationPopup`'s `onVerify` prop currently has a `// TODO` placeholder.
When the backend OTP endpoint is ready, wire it here in `ProfileComponents.jsx`:
```js
onVerify={async () => {
  const code = otp.join("");
  // call your OTP verification API
  // on success: setOriginalEmail(profile.email); popOTP(false);
}}
```
