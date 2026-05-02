<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Recurly, an Expo/React Native subscription billing app. Here is a summary of all changes made:

- **`app.config.js`** (new) — Expo dynamic config that exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` to the app via `Constants.expoConfig.extra`.
- **`src/config/posthog.ts`** (new) — PostHog client singleton. Reads config from `expo-constants`, enables app lifecycle capture, and disables itself gracefully when no token is configured.
- **`app/_layout.tsx`** — Wrapped the root layout with `PostHogProvider` (with touch autocapture) and added a `ScreenTracker` component that calls `posthog.screen()` on every route change using Expo Router's `usePathname` and `useGlobalSearchParams`.
- **`app/(auth)/signIn.tsx`** — Captures `sign_in_completed` (+ `posthog.identify`) on successful login, and `sign_in_failed` with error details on failure. Also covers MFA verification.
- **`app/(auth)/signUp.tsx`** — Captures `sign_up_completed` (+ `posthog.identify` with `sign_up_date`) on successful account creation/verification, and `sign_up_failed` with error details on failure.
- **`app/(tabs)/settings.tsx`** — Captures `sign_out` and calls `posthog.reset()` before the Clerk `signOut()` call to clear the PostHog anonymous/identified session.
- **`app/(tabs)/index.tsx`** — Captures `subscription_expanded` with `subscription_id`, `subscription_name`, and `subscription_category` when a user expands a card on the home screen.
- **`app/subscriptions/[id].tsx`** — Captures `subscription_detail_viewed` with `subscription_id` on mount.
- **`app/onboarding.tsx`** — Captures `onboarding_viewed` in `componentDidMount` (class component).

## Events

| Event | Description | File |
|---|---|---|
| `sign_in_completed` | User successfully signs in with email/password or MFA | `app/(auth)/signIn.tsx` |
| `sign_in_failed` | Sign-in attempt fails (invalid credentials or server error) | `app/(auth)/signIn.tsx` |
| `sign_up_completed` | User creates and verifies a new account | `app/(auth)/signUp.tsx` |
| `sign_up_failed` | Sign-up attempt fails due to a server error | `app/(auth)/signUp.tsx` |
| `sign_out` | User signs out from the Settings screen | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User expands a subscription card on the home screen | `app/(tabs)/index.tsx` |
| `subscription_detail_viewed` | User views the detail page for a specific subscription | `app/subscriptions/[id].tsx` |
| `onboarding_viewed` | User views the onboarding screen (top of acquisition funnel) | `app/onboarding.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/406455/dashboard/1535881
- **Sign-in & Sign-up: Registration Funnel**: https://us.posthog.com/project/406455/insights/5MR9CAww
- **Daily Sign-ins**: https://us.posthog.com/project/406455/insights/w3zxtVYS
- **Sign-in Failure Rate**: https://us.posthog.com/project/406455/insights/qg3DCaA5
- **Subscription Engagement**: https://us.posthog.com/project/406455/insights/nY4UuyTU
- **Churn Signal: Sign-outs Over Time**: https://us.posthog.com/project/406455/insights/PHVpo20k

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
