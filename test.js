const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page = await context.newPage();

  const url = 'https://fxh-staking-dapp.vercel.app';
  const errors = [];

  page.on('pageerror', err => {
    console.log('❌ JS Error:', err.message);
    errors.push(err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('🚀 Testing FXH Staking DAPP...\n');

  // 1. Load homepage
  console.log('1️⃣  Loading homepage...');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(3000);

  // Check for syntax error popup
  const hasSyntaxError = errors.some(e => e.includes('Unexpected token') || e.includes('SyntaxError'));
  if (hasSyntaxError) {
    console.log('   ❌ SyntaxError detected!');
  } else {
    console.log('   ✅ No JS syntax errors');
  }

  // Check balance ticker
  const balance = await page.locator('#balance-num').textContent();
  console.log('   💰 Balance:', balance);

  // 2. Close bind modal if present
  console.log('\n2️⃣  Checking bind modal...');
  const bindSheet = await page.locator('#bind-sheet').isVisible().catch(() => false);
  if (bindSheet) {
    console.log('   📋 Bind modal visible');
    await page.locator('#bind-sheet button:has-text("跳过")').click();
    await page.waitForTimeout(500);
    console.log('   ✅ Skipped bind modal');
  }

  // 3. Test Tab: Rewards
  console.log('\n3️⃣  Testing Rewards tab...');
  await page.locator('.tab-item:has-text("收益")').click();
  await page.waitForTimeout(800);

  // Check buttons
  const claimBtn = await page.locator('button:has-text("一键领取")').isVisible();
  const nodeBtn = await page.locator('button:has-text("节点")').isVisible();
  console.log('   💎 Claim button:', claimBtn ? '✅' : '❌');
  console.log('   🎯 Node button:', nodeBtn ? '✅' : '❌');

  if (claimBtn) {
    await page.locator('button:has-text("一键领取")').click();
    await page.waitForTimeout(500);
    console.log('   ✅ Claim button clickable');
  }

  if (nodeBtn) {
    await page.locator('button:has-text("节点")').click();
    await page.waitForTimeout(500);
    console.log('   ✅ Node button clickable');
  }

  // 4. Test Tab: Mining
  console.log('\n4️⃣  Testing Mining tab...');
  await page.locator('.tab-item:has-text("挖矿")').click();
  await page.waitForTimeout(800);

  const stakeBtn = await page.locator('button:has-text("追加质押")').isVisible();
  console.log('   ➕ Stake button:', stakeBtn ? '✅' : '❌');

  if (stakeBtn) {
    await page.locator('button:has-text("追加质押")').click();
    await page.waitForTimeout(800);
    const sheetOpen = await page.locator('#stake-sheet').evaluate(el => el.classList.contains('open'));
    console.log('   📋 Stake sheet opened:', sheetOpen ? '✅' : '❌');

    if (sheetOpen) {
      await page.locator('#stake-sheet button:has-text("✕")').click();
      await page.waitForTimeout(300);
      console.log('   ✅ Stake sheet closed');
    }
  }

  // 5. Test Tab: Settings
  console.log('\n5️⃣  Testing Settings tab...');
  await page.locator('.tab-item:has-text("设置")').click();
  await page.waitForTimeout(800);

  const walletBtn = await page.locator('button:has-text("连接")').first().isVisible();
  console.log('   👛 Wallet button:', walletBtn ? '✅' : '❌');

  if (walletBtn) {
    await page.locator('button:has-text("连接")').first().click();
    await page.waitForTimeout(500);
    console.log('   ✅ Wallet button clickable');
  }

  // 6. Test Tab: Invite
  console.log('\n6️⃣  Testing Invite tab...');
  await page.locator('.tab-item:has-text("邀请")').click();
  await page.waitForTimeout(800);

  const copyBtn = await page.locator('button:has-text("复制")').isVisible();
  console.log('   📋 Copy button:', copyBtn ? '✅' : '❌');

  if (copyBtn) {
    await page.locator('button:has-text("复制")').click();
    await page.waitForTimeout(500);
    console.log('   ✅ Copy button clickable');
  }

  // 7. Test Tab: Home
  console.log('\n7️⃣  Testing Home tab...');
  await page.locator('.tab-item:has-text("首页")').click();
  await page.waitForTimeout(800);

  const homeStake = await page.locator('button:has-text("质押")').first().isVisible();
  console.log('   🔒 Home stake button:', homeStake ? '✅' : '❌');

  if (homeStake) {
    await page.locator('button:has-text("质押")').first().click();
    await page.waitForTimeout(800);
    const sheetOpen = await page.locator('#stake-sheet').evaluate(el => el.classList.contains('open'));
    console.log('   📋 Stake sheet from home:', sheetOpen ? '✅' : '❌');
    if (sheetOpen) {
      await page.locator('#stake-sheet button:has-text("✕")').click();
      await page.waitForTimeout(300);
    }
  }

  // 8. Test Carousel
  console.log('\n8️⃣  Testing Carousel...');
  await page.locator('.carousel-dot').nth(1).click();
  await page.waitForTimeout(500);
  console.log('   🖼️  Carousel dot clickable: ✅');

  // Screenshot
  await page.screenshot({ path: '/home/hhh/.openclaw/workspace/fxh-staking-dapp/test-result.png', fullPage: true });
  console.log('\n📸 Screenshot saved: test-result.png');

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (errors.length > 0) {
    console.log('❌ Errors found:', errors.length);
    errors.forEach(e => console.log('   -', e.substring(0, 100)));
  } else {
    console.log('✅ All tests passed! No JS errors.');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await browser.close();
})();
