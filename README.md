# dol-match-bracket

- Javascript Library to make tree structured tournament brackets.
- using Recursion to generate tournament bracket based on match JSON not team JSON(example below)

## Install

- npm install

```sh
$ npm install
```

- gulp Development Mode - local server and watch

```sh
$ gulp dev
```

- gulp bulid

```sh
$ gulp
or
$ gulp build
```

## Common Structure.

<pre>
├── dol-bracket-match
    ├── dol-bracket-main
        └── dol-bracket-item  
            (information: score, team name ex= team1 vs team2)
    └── dol-bracket-sub
        └── dol-bracket-match (dol-bracket-left or dol-bracket-right)
            ├── dol-bracket-main
                └── dol-bracket-item
            └── dol-bracket-sub
                ...
</pre>

### Data Example

```
<body>
<div id="dol-bracket"></div>
const arr = [
        {
          id: 1, //required
          school1: 'a', //required -> team1 name
          score1: 9,   //team1 score
          score2: 4,   //team1 score
          school2: 'b',  //required -> team2 name
          state: 'ended',
          next: 3, //required this indicates parents bracket idx
        },
        ...
        ]
   MakeDolBracket('#dol-bracket', arr, {});
</body>
```

- result:
<pre>
                  (final)  
          |`team3or4 : team5or6`| 
    (semi-final)     |     (semi-final)
  |`team3: team4`|       |`team5: team6`|
  ...

</pre>
