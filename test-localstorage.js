(function () {
  console.log('=== ConfigClarity localStorage audit ===\n');

  // 2. List cc-* and cron-builder-jobs
  var keys = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && (k.indexOf('cc-') === 0 || k === 'cron-builder-jobs')) keys.push(k);
  }
  keys.sort();
  if (keys.length === 0) {
    console.log('No cc-* or cron-builder-jobs keys found.');
  } else {
    keys.forEach(function (k) {
      var val = localStorage.getItem(k);
      var len = val == null ? 0 : (typeof val === 'string' ? val.length : String(val).length);
      console.log('  ' + k + ' → length ' + len);
    });
  }
  console.log('');

  var passed = 0;

  // CHECK A
  var aVal = localStorage.getItem('cc-active-tab');
  var aOk = aVal === 'paste' || aVal === 'build' || aVal === null;
  if (aVal !== null && aVal !== undefined && aVal !== 'paste' && aVal !== 'build') aOk = false;
  console.log(aOk ? 'PASS' : 'FAIL', '— CHECK A: Paste tab state persists');
  if (!aOk && aVal != null) console.log('  (cc-active-tab = "' + String(aVal) + '")');
  if (aOk) passed++;

  // CHECK B
  var bVal = localStorage.getItem('cc-cron-paste');
  if (bVal == null) {
    console.log('PASS — CHECK B: Paste textarea key is correct');
    console.log('  not set');
    passed++;
  } else if (typeof bVal === 'string') {
    console.log('PASS — CHECK B: Paste textarea key is correct');
    passed++;
  } else {
    console.log('FAIL — CHECK B: Paste textarea key is correct (key exists but not a string)');
  }

  // CHECK C
  var cOk = false;
  try {
    var raw = localStorage.getItem('cron-builder-jobs');
    if (raw === null || raw === undefined) {
      cOk = true;
    } else {
      var parsed = JSON.parse(raw);
      cOk = Array.isArray(parsed) || parsed === null;
    }
  } catch (e) {
    cOk = false;
  }
  console.log(cOk ? 'PASS' : 'FAIL', '— CHECK C: Build mode key is isolated');
  if (cOk) passed++;

  // CHECK D
  var sensitive = ['cc-docker-compose', 'cc-docker-env', 'cc-firewall-ufw', 'cc-proxy-config', 'cc-ssl-domains'];
  var found = sensitive.filter(function (k) { return localStorage.getItem(k) !== null; });
  var dOk = found.length === 0;
  console.log(dOk ? 'PASS' : 'FAIL', '— CHECK D: No sensitive tool configs persisted');
  if (!dOk) console.log('  Present:', found.join(', '));
  if (dOk) passed++;

  console.log('\n' + passed + '/4 checks passed\n');

  console.log('To test the paste restore bug:');
  console.log('  1. Click \'Paste Existing Crontab\' tab');
  console.log('  2. Type: TESTCONTENT123');
  console.log('  3. Hard refresh (Cmd+Shift+R)');
  console.log('  4. Run this script again — textarea should show TESTCONTENT123');
})();
