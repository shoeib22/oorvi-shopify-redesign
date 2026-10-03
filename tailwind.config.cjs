module.exports = {
  content: ['./layout/**/*.liquid','./sections/**/*.liquid','./snippets/**/*.liquid'],
  theme: { extend: {
    colors: { brand: { bg:'#faf7ed',card:'#e5eadb',olive:'#244a35',oliveHover:'#386348',textDark:'#244a35',textLight:'#657064',border:'#d9ddce' } },
    fontFamily: { sans:['DM Sans','sans-serif'],serif:['DM Sans','sans-serif'],cursive:['Bodoni Moda','serif'] },
  } },
};
