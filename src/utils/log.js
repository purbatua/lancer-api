


exports.beauty = function(arg1, arg2) {
  if(!arg2) {
    console.log(JSON.stringify(arg1, null, 2))
    return;
  }
  console.log(arg1 + '\n', JSON.stringify(arg2, null, 2))
  return;
}