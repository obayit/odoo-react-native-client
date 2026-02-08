function _guessMimetype(ext = false, defaultType = 'text/html') {
  const exts = {
    '.css': 'text/css',
    '.less': 'text/less',
    '.scss': 'text/scss',
    '.js': 'text/javascript',
    '.xml': 'text/xml',
    '.csv': 'text/csv',
    '.html': 'text/html',
  };

  return ext !== false ? (exts[ext] || defaultType) : exts;
}

function slugifyOne(s, { maxLength = 0 } = {}) {
  if (s == null) return '';

  s = String(s);

  // Optional external slugify library support
  /*
  if (typeof slugifyLib !== 'undefined' && slugifyLib?.slugify) {
    try {
      return slugifyLib.slugify(s, { maxLength });
    } catch (e) {
      // fall through, like Python
    }
  }
  */

  // Unicode normalize + strip diacritics
  const ascii = s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  let slugStr = ascii
    .replace(/[\W_]+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');

  return maxLength > 0 ? slugStr.slice(0, maxLength) : slugStr;
}

function slugify(s, { maxLength = 0, path = false } = {}) {
  if (!path) {
    return slugifyOne(s, { maxLength });
  }

  const res = [];

  for (const u of s.split('/')) {
    const slug = slugifyOne(u, { maxLength });
    if (slug !== '') {
      res.push(slug);
    }
  }

  // check if supported extension
  const lastDot = s.lastIndexOf('.');
  if (lastDot !== -1) {
    const pathNoExt = s.slice(0, lastDot);
    const ext = s.slice(lastDot);

    if (ext && _guessMimetype().has(ext)) {
      res[res.length - 1] = slugifyOne(pathNoExt) + ext;
    }
  }

  return res.join('/');
}

export default function slug(value) {
  console.log('#value');
  console.log(value);
  let identifier, name;

  try {
    if (!value.id) {
      throw new Error(`Cannot slug non-existent record ${value}`);
    }
    identifier = value.id;
    name = value.seo_name || value.display_name;
  } catch (err) {
    // assume name_search result tuple: [id, name]
    identifier = value[0];
    name = value[1];
  }
  console.log('#name');
  console.log(name);

  const slugname = slugify(name || '')
    .trim()
    .replace(/^-+|-+$/g, '');

  if (!slugname) {
    return String(identifier);
  }

  return `${slugname}-${identifier}`;
}