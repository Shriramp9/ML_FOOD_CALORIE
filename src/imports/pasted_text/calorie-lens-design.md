Design a mobile-first food calorie tracking app called "CalorieLens" with a premium dark mode UI. The app uses AI/YOLO to detect food from camera photos.

Design System:

Background: #0A0A0F (near black)
Surface cards: #13131A with rgba(255,255,255,0.04) glassmorphism effect, 1px solid rgba(255,255,255,0.08) border, border-radius: 20px
Primary accent: #00E5A0 (mint green — represents health/freshness)
Secondary accent: #7C3AED (deep violet — AI/tech feel)
Warning: #FF6B6B (soft red for high-calorie alerts)
Text primary: #FFFFFF
Text secondary: #8B8B9E
Font: Inter (Google Fonts) — Bold 700 for headings, Regular 400 for body, Medium 500 for labels
Gradient: linear-gradient(135deg, #00E5A0 0%, #7C3AED 100%) used on CTAs and highlights
Screen 1 — Onboarding / Login

Full screen dark background with floating food emoji particles (🍎🍕🥗) subtly animated in background
Centered logo: a circular icon with gradient ring, fork+lens icon inside
App name "CalorieLens" in bold white, tagline "Eat Smart. See Clear." in secondary text
Two buttons: "Get Started" (gradient bg, rounded pill) and "I have an account" (ghost button with border)
Bottom text: "Powered by YOLOv8 AI"
Screen 2 — Signup / Login Form

Back arrow top left
Heading: "Create Account" or "Welcome Back"
Input fields: dark surface, rounded 14px, subtle glow on focus (#00E5A0 border)
Fields: Full Name, Email, Password (with show/hide toggle), Confirm Password
"Continue" CTA button — full width, gradient
Divider with "or" — Google Sign In button below
Link: "Already have an account? Login"
Screen 3 — User Profile Setup (Onboarding Step)

Progress bar at top showing Step 2 of 2
Heading: "Tell us about yourself"
Animated card with avatar/emoji selector at top
Input sliders (custom styled, mint green thumb):
Age (10–80)
Weight in kg
Height in cm
Radio toggle for Gender: Male / Female (pill toggle, selected = gradient bg)
Activity level: 4 cards in a 2x2 grid — Sedentary, Light, Active, Very Active — icon + label, selected card has gradient border glow
At bottom: a metric card showing "Your Daily Goal: 2,100 kcal" that updates live as user adjusts sliders
CTA: "Let's Go →" gradient pill button
Screen 4 — Home / Dashboard

Top bar: Avatar thumbnail (left), "Good Morning, Aryan 👋" greeting, notification bell (right)
Hero Calorie Ring Card: Large circular progress ring, mint green stroke on dark ring, center shows "1,240 / 2,100 kcal", subtext "892 kcal remaining"
Below ring: 3 macro mini-cards in a row — Protein 🥩 | Carbs 🍞 | Fat 🧈 — each shows value + small horizontal progress bar
Quick Add Button: Large floating action button (FAB) — circular, gradient, camera icon, positioned bottom center
Today's Meals section: Scrollable vertical list of meal cards — each card has:
Left: small food thumbnail (from detection result)
Center: meal name, time tag (Breakfast / Lunch), number of items
Right: calorie count in mint green bold
Swipe left to delete gesture indicator
Bottom Navigation Bar: 5 icons — Home, Scan (camera, larger, gradient bg), History, Reports, Profile
Screen 5 — Scan / Detect Screen

Full screen camera viewfinder (dark borders on sides)
Top: "Point at your food" instruction in white, small X button top right
Center: Animated scanning frame — 4 corner brackets animated (pulsing mint green)
Below viewfinder: 3 quick options in a row: 📷 Camera | 🖼️ Gallery | 📦 Barcode
Bottom sheet (slides up after detection):
Drag handle at top
"3 items detected!" heading
Horizontal scroll list of detected food cards: food name, bounding box color swatch, confidence %
Full nutrition table below
"Add to Today's Log" button — gradient, full width
Screen 6 — Detection Results

Top: Detected image with colored bounding boxes drawn on top, each box has a floating label chip (food name + kcal)
Below image: Scrollable results section
Each food item shown as a card:
Food icon/emoji (left)
Name + portion size
Calorie count (large, mint green)
Expandable row: shows Protein | Carbs | Fat in small chips
Total summary bar at bottom: "Total: 680 kcal" with a progress fill animation
Healthy swap suggestion card (if applicable): yellow/amber card with lightbulb icon, swap text
Two buttons: "Save Meal" (gradient) | "Re-scan" (ghost)
Screen 7 — History

Header: "Meal History" with date filter chips — Today / This Week / This Month
Grouped by date (section headers like "Today", "Yesterday", "April 18")
Each entry: time pill tag, food thumbnail grid (3 tiny images in row), calorie total, chevron to expand
Expanded state shows full food list with macros
Delete swipe gesture with red trash reveal
Screen 8 — Reports / Analytics

Header: "Your Insights"
7-Day Calorie Trend: Line chart with gradient fill under line (mint green), X axis = days, Y axis = kcal, daily goal shown as dashed horizontal line
Weekly Macro split: Donut chart, 3 colors for protein/carbs/fat, legend below
Stat cards row: Best Day | Avg Daily | Days on Goal — each in a dark surface card
AI Insight card: Purple/violet accent card with sparkle icon ✨ — "You're eating 30% more carbs than your goal. Consider adding more protein-rich foods." — ML-generated text
Streak card: Flame emoji 🔥, "5 Day Healthy Streak!" with mini calendar dots showing green/red per day
Screen 9 — Profile

Avatar with edit button
Name, email below
Stats row: Weight | Height | BMI — calculated and displayed
BMI card: Colored indicator bar (underweight → obese scale), user's marker on it
Editable profile fields in surface cards
Settings section: Notifications toggle, Dark mode toggle, Units (metric/imperial), Allergen preferences
"Export My Data" button
"Sign Out" — red text link at bottom
Component Details:

All cards: border-radius: 20px, subtle shadow 0 4px 24px rgba(0,0,0,0.4)
All buttons: border-radius: 50px (pill shape), height 52px
Icons: Lucide icon set
Micro-animations: card entrance slide-up with fade, button press scale-down 0.96, ring progress animated on load
Haptic feedback indicators on scan button
All screens should have safe area insets for iPhone notch/Android status bar
Design for 375×812px (iPhone 14 base) — ensure it scales to 390px and 412px
Deliverables in Figma:

All 9 screens in mobile frame
Component library panel (buttons, cards, inputs, icons)
Color styles + text styles defined
Auto-layout on all components
Prototype connections between screens (clickable flow)