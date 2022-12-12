const fs = require('fs')
const path = require('path')

let input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`

input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let passports = input
    .split("\n\n")
    .map(s => s.split("\n").flatMap(s => s.split(" ")))
    .map(p => p.map(f => f.split(":")))

let fieldValidation = {
    'byr' : v => { let value = Number.parseInt(v); return value >= 1920 && value <= 2002 },
    'iyr' : v => { let value = Number.parseInt(v); return value >= 2010 && value <= 2020 },
    'eyr' : v => { let value = Number.parseInt(v); return value >= 2020 && value <= 2030 },
    'hgt' : v => { 
        let values = v.split(/([0-9]+)(in|cm)/)
        if (values.length != 4) return false
        let height = Number.parseInt(values[1])
        if (values[2] == 'cm') return height >= 150 && height <= 193
        if (values[2] == 'in') return height >= 59 && height <= 76
        return false;
    },
    'hcl' : v => /#[0-9a-f]{6}/.test(v),
    'ecl' : v => ['amb','blu','brn','gry','grn','hzl','oth'].includes(v),
    'pid' : v => /[0-9]{9}/.test(v)
}

function validatePassport(expectedFields, passport) {
    let fields = passport.map(p => p[0]);
    let valid = expectedFields.filter(f => fields.includes(f)).length == expectedFields.length
    return valid;
}

function validatePassport2(validationRules, passport) {
    return passport.map(p => {
        let rule = validationRules[p[0]]?validationRules[p[0]](p[1]):true
        if (rule) console.log(p)
        return rule
    }
        ).filter(p => !p).length == 0
}

console.log( "Day 04 - part 1:", passports.map(p => validatePassport(Object.keys(fieldValidation),p)).filter(p => p).length )

console.log( "Day 04 - part 2:", 
    passports
        .filter(p => validatePassport(Object.keys(fieldValidation),p))
        .map(p => validatePassport2(fieldValidation,p)).filter(p => p).length
)
