# Production Deployment Checklist

Use this checklist before deploying TrustFund to production.

## 🔐 Security

- [ ] All sensitive data in `.env.local` (never commit this file)
- [ ] `.env.example` updated with all required variables
- [ ] Private keys stored securely (use hardware wallet for mainnet)
- [ ] Smart contracts audited (recommended for mainnet)
- [ ] Rate limiting implemented on API routes
- [ ] Input validation on all forms
- [ ] CORS properly configured
- [ ] Environment variables set in hosting platform

## 🌐 Smart Contracts

- [ ] Contracts tested thoroughly on testnet
- [ ] Gas optimization reviewed
- [ ] Contract verified on block explorer
- [ ] Contract address updated in `.env.local`
- [ ] Network configuration correct (mainnet/testnet)
- [ ] Sufficient funds for deployment in deployer wallet

## 📦 Frontend

- [ ] All hardcoded values replaced with environment variables
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] All images optimized
- [ ] Meta tags and SEO configured
- [ ] Favicon and app icons added
- [ ] Analytics configured (if needed)
- [ ] Error tracking setup (e.g., Sentry)

## 🎨 UI/UX

- [ ] Tested on major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified
- [ ] Dark and light themes working correctly
- [ ] All loading states implemented
- [ ] Error states handled gracefully
- [ ] Success messages clear and helpful
- [ ] Accessibility features tested
- [ ] Keyboard navigation works

## 🔌 API & Services

- [ ] Pinata API keys configured
- [ ] IPFS gateway accessible
- [ ] RPC endpoint reliable and fast
- [ ] API rate limits appropriate
- [ ] Error handling for all API calls
- [ ] Timeouts configured

## 📱 Testing

- [ ] All user flows tested end-to-end
- [ ] Wallet connection tested
- [ ] Campaign creation tested
- [ ] Donation flow tested
- [ ] Dashboard functionality verified
- [ ] Edge cases handled (no campaigns, failed transactions, etc.)
- [ ] Performance tested (Lighthouse score)

## 📄 Documentation

- [ ] README.md updated and accurate
- [ ] API documentation complete
- [ ] Deployment guide clear
- [ ] Environment variables documented
- [ ] Troubleshooting section added
- [ ] License file present

## 🚀 Deployment

- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] CDN configured (if needed)
- [ ] Backup strategy in place
- [ ] Monitoring setup
- [ ] Logging configured
- [ ] Rollback plan ready

## 📊 Post-Deployment

- [ ] Verify all pages load correctly
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify smart contract interactions
- [ ] Test wallet connections on production
- [ ] Monitor gas costs
- [ ] Check IPFS file accessibility

## 🔄 Maintenance

- [ ] Update dependencies regularly
- [ ] Monitor security advisories
- [ ] Backup important data
- [ ] Keep documentation updated
- [ ] Review and respond to user feedback
- [ ] Plan for future enhancements

## 📞 Support

- [ ] Support channels established
- [ ] FAQ section created
- [ ] Issue tracking setup
- [ ] Community guidelines published

---

## Quick Deployment Commands

### Build for Production
```bash
npm run build
npm start
```

### Deploy Smart Contracts (Sepolia)
```bash
npm run deploy:sepolia
npm run verify:sepolia
```

### Environment Variables Required
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_ADDRESS`
- `NEXT_PUBLIC_PRIVATE_KEY`
- `PINATA_API_KEY`
- `PINATA_SECRET_API_KEY`
- `NEXT_PUBLIC_IPFS_GATEWAY`

---

**Remember**: Test everything on testnet before mainnet deployment!
