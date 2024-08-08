---
title: Python Regex
---

```python
## findall() function returns a list containing all match strings.
txt = 'The rain in Spain'
x = re.findall('ai', txt)
print(x)

## search() function searches the string for a match, and returns a Match object if there is a match.
txt = 'The rain in Spain'
x = re.search('^The.*Spain$', txt)
print(x)

## split() function returns a list where the string has been split at each match.
txt = 'The rain in Spain'
x = re.split('\s', txt)
print(x)

## sub() function replaces the matches with the text of your choice.
txt = 'The rain in Spain'
x = re.sub('\s', '9', txt)
print(x)
```

```python
## [] - A set of characters
txt = 'The rain in Spain'
x = re.findall('The [a-z]* in Spain',txt)
print(x)

## [^] - Excludes a set of characters
txt = 'The rain in Spain'
x = re.findall('The [^a-z]* in Spain',txt)
print(x)

## . - Any character (except newline character)
txt = 'The rain in Spain'
x = re.findall('T....',txt)
print(x)

## | - Either or
txt = 'The rain in Spain'
x = re.findall('rain|Spain',txt)
print(x)
```

```python
## ^ - Starts with
txt = 'The rain in Spain'
x = re.findall('^The.*',txt)
print(x)
x = re.findall('^rain',txt)
print(x)

## $ - Ends with
x = re.findall('.*Spain$',txt)
print(x)
x = re.findall('.*sp$',txt)
print(x)
```

```python
## * - Zero or more occurrences
txt = 'The rain in Spain'
x = re.findall('S.*n',txt)
print(x)
x = re.findall('S.*p',txt)
print(x)

## + - One or more occurrences
txt = 'The rain in Spain'
x = re.findall('S.+n',txt)
print(x)
x = re.findall('S.+p',txt)
print(x)

## ? - Zero or one occurrences
txt = 'The rain in Spain'
x = re.findall('Spa.?n',txt)
print(x)

## () - Capturing group
x = re.findall('Spa(in)?',txt)
print(x)
x = re.findall('(Spa)(in)?',txt)
print(x)
## ?: - Non-capturing group
x = re.findall('Spa(?:in)?',txt)
print(x)

## {} - Exactly the specified number of occurrences
txt = 'hello helo'
x = re.findall('he.{2}o',txt)
print(x)
x = re.findall('he.{1}o',txt)
print(x)
```

```python
## \d - [0-9]
txt = 'The rain in Spain 123'
x = re.findall('\d',txt)
print(x)

## \s - space
txt = 'The rain in Spain 123'
x = re.findall('\s',txt)
print(x)

## \w - [a-zA-Z0-9_]
txt = 'The rain in Spain 123'
x = re.findall('\w',txt)
print(x)

## \D \S \W - Opposite of \d \s \w
txt = 'The rain in Spain 123'
x = re.findall('\D',txt)
print(x)

## \A - Returns a match if the specified characters are at the beginning of the string
txt = 'The rain in Spain'
x = re.findall('\AThe',txt)
print(x)
x = re.findall('\Ain',txt)
print(x)

## \Z - Returns a match if the specified characters are at the end of the string
txt = 'The rain in Spain'
x = re.findall('Spain\Z',txt)
print(x)

## \b - Returns a match where the specified characters are at the beginning or at the end of a word
txt = 'The rain in Spain'
x = re.findall(r'\bTh',txt)
print(x)

## \B - Returns a match where the specified characters are present, but NOT at the beginning (or at the end) of a word
txt = 'The rain in Spain'
x = re.findall(r'\BTh',txt)
print(x)
```
