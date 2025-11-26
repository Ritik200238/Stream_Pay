# StreamPay Wave 3 Submission - Final Checklist

## 🎯 Complete Before Deadline (Nov 30, 2025)

---

## ✅ Step 1: Record Demo Video (15-30 minutes)

- [ ] Backend running: `linera service --port 8080`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Browser at `http://localhost:3000`
- [ ] Follow script in `DEMO_SCRIPT.md`
- [ ] Record 2-minute demo showing:
  - Green "Connected to Conway Testnet" banner
  - Live counter ticking up in real-time
  - Creating a new stream
  - Explaining use cases
  - Showing deployed App IDs

**Recommended Tools**:
- Windows: Game Bar (Win+G) - built-in, easy
- OBS Studio - free, professional
- Loom - easy screen recording with webcam

---

## ✅ Step 2: Upload Video to YouTube (5 minutes)

- [ ] Go to youtube.com
- [ ] Click "Create" → "Upload Video"
- [ ] Choose your recorded video file
- [ ] Set visibility: **Unlisted** or **Public**
- [ ] Title: `StreamPay - Real-Time Payment Streaming on Linera (Wave 3)`
- [ ] Description:
```
StreamPay demonstrates real-time payment streaming on Linera blockchain.

Deployed on Conway Testnet:
- Stream App: fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb
- Token App: b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e
- Chain ID: ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f

Built for Linera Wave 3 Buildathon - November 2025
```
- [ ] Copy the YouTube URL (e.g., `https://youtu.be/ABC123`)

---

## ✅ Step 3: Push to GitHub (10 minutes)

If you haven't already:

```bash
cd C:\Users\prate\linera\streampay

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create commit
git commit -m "StreamPay - Wave 3 Buildathon submission

- Token and Stream apps deployed to Conway Testnet
- Frontend connected via GraphQL
- Real-time payment streaming with live counter
- Full deployment documentation included"

# Create GitHub repo (via web interface):
# 1. Go to github.com
# 2. Click "New repository"
# 3. Name: streampay
# 4. Make it PUBLIC
# 5. Don't initialize with README (we have one)

# Push to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/streampay.git
git branch -M main
git push -u origin main
```

- [ ] Repository is PUBLIC
- [ ] All code is pushed
- [ ] README.md exists and is informative
- [ ] Copy repository URL (e.g., `https://github.com/YOUR_USERNAME/streampay`)

---

## ✅ Step 4: Fill Out Submission Form (10 minutes)

Go to the Wave 3 Buildathon submission page and enter:

### Basic Information
- [ ] **Project Name**: StreamPay
- [ ] **Tagline**: Get paid by the second, not by the month
- [ ] **Category**: DeFi / Payments
- [ ] **Your Name**: [Your Name]
- [ ] **Email**: [Your Email]

### Links
- [ ] **Demo Video URL**: [Your YouTube URL]
- [ ] **GitHub Repository**: [Your GitHub URL]
- [ ] **Live Demo URL**: http://localhost:3000 (or deployed URL if you deployed frontend)

### Deployment Details
- [ ] **Network**: Conway Testnet
- [ ] **Chain ID**: `ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f`
- [ ] **Token App ID**: `b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e`
- [ ] **Stream App ID**: `fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb`

### Project Description
Copy from `WAVE3_SUBMISSION.md` or write:

```
StreamPay is a real-time payment streaming platform built on Linera. It enables continuous, second-by-second payment flows leveraging Linera's microchain architecture for sub-50ms updates.

Key Features:
- Live balance counter updating in real-time
- Create payment streams with custom rates
- Withdraw funds anytime
- Full Conway Testnet deployment

StreamPay solves real-world problems in payroll, subscriptions, freelancing, and grants by eliminating the 30-day wait for traditional payroll and the high fees of Ethereum.

Technical Stack:
- Rust smart contracts (Token + Stream apps)
- React frontend with TypeScript
- GraphQL integration with Linera service
- Deployed and operational on Conway Testnet
```

### Technical Details
- [ ] **Smart Contracts**: Rust (Token App + Stream App)
- [ ] **Frontend**: React + TypeScript + Vite
- [ ] **Integration**: GraphQL API
- [ ] **Deployment Status**: Fully deployed and operational

---

## ✅ Step 5: Double-Check Everything (5 minutes)

Before clicking "Submit":

- [ ] Demo video plays correctly on YouTube
- [ ] GitHub repo is public and accessible
- [ ] All App IDs are correct
- [ ] Chain ID matches your deployment
- [ ] Email address is correct (for prize notification!)
- [ ] Video shows the green "Connected to Conway" banner
- [ ] No typos in project description

---

## ✅ Step 6: Submit! (1 minute)

- [ ] Click "Submit" button
- [ ] Take a screenshot of confirmation page
- [ ] Save confirmation email if you receive one
- [ ] Celebrate! 🎉

---

## 📋 Quick Reference - Your Deployment Info

**Copy-paste ready for submission form:**

```
Project: StreamPay
Network: Conway Testnet
Chain ID: ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f
Token App: b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e
Stream App: fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb
GraphQL: http://localhost:8080
```

---

## ⏰ Time Estimate

Total time to complete submission: **45-60 minutes**

- Record demo: 15-30 min
- Upload to YouTube: 5 min
- Push to GitHub: 10 min
- Fill submission form: 10 min
- Double-check: 5 min

---

## 🆘 If You Get Stuck

### Demo Video Issues
- Use Windows Game Bar (Win+G) - easiest option
- Speak clearly, don't rush
- If you mess up, just re-record that section

### GitHub Issues
- Make sure repo is PUBLIC, not private
- If push fails, check your GitHub credentials
- You can upload files manually via web interface if needed

### Submission Form Issues
- Save a draft if the form allows it
- Take screenshots as you go
- Have all URLs ready before starting

---

## 🎉 After Submission

- [ ] Keep backend running (`linera service --port 8080`) in case judges want to test
- [ ] Monitor your email for judge questions or feedback
- [ ] Join Linera Discord to see other submissions
- [ ] Start planning Wave 4 improvements (cyberpunk UI! 🚀)

---

## 🏆 You've Got This!

StreamPay is fully deployed, working, and ready to impress the judges. The hard technical work is done - now it's just about presenting it well!

**Don't wait. Stream.** ⚡

---

Good luck! 🍀
