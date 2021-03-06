"use strict";
var app = require('..');
var chai = require('chai');
var expect = chai.expect;
var pargs = require('../lib');

describe('the args object', function () {
    describe('options with dots in the name', function () {
        it('should parse to objects', function () {
            pargs.option({
                name: 'foo.bar',
                type: 'string'
            });
            var args = pargs.run([ '--foo.bar=qux' ]);
            expect(args.options.foo.bar).to.equal('qux');
        });
    });
    describe('options with `addToCollection`', function () {
        it('should be parsed and added into the collection property', function () {
            pargs.option({
                name: 'foo',
                type: 'csv,string',
                addToCollection: true
            });
            pargs.option({
                name: 'bar',
                type: 'csv,string',
                addToCollection: true
            });
            var args = pargs.run([ '--foo=bar,qux', '--bar=baz,zip' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo).to.equal('bar');
            expect(args.collection[1].foo).to.equal('qux');
            expect(args.collection[0].bar).to.equal('baz');
            expect(args.collection[1].bar).to.equal('zip');
        });
        it('should omit for empty values when added to collection', function () {
            pargs.option({
                name: 'foo',
                type: 'csv,string',
                addToCollection: true
            });
            pargs.option({
                name: 'bar',
                type: 'csv,string',
                addToCollection: true
            });
            var args = pargs.run([ '--foo=,qux', '--bar=baz' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo).to.be.an('undefined');
            expect(args.collection[1].foo).to.equal('qux');
            expect(args.collection[0].bar).to.equal('baz');
            expect(args.collection[1].bar).to.be.an('undefined');
        });
        it('should be parsed as objects options with dots in the name', function () {
            pargs.option({
                name: 'foo.bar',
                type: 'csv,string',
                addToCollection: true
            });
            pargs.option({
                name: 'foo.gee',
                type: 'csv,string',
                addToCollection: true
            });
            pargs.option({
                name: 'qux.zip',
                type: 'csv,string',
                addToCollection: true
            });
            pargs.option({
                name: 'qux.dup.goo.dod',
                type: 'csv,string',
                addToCollection: true
            });
            var args = pargs.run([ '--foo.gee=well,wee,,poo', '--foo.bar=bam,doo', '--qux.zip=wer,bop', '--qux.dup.goo.dod=sis,boo,baa' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo.bar).to.equal('bam');
            expect(args.collection[0].qux.dup.goo.dod).to.equal('sis');
            expect(args.collection[0].foo.gee).to.equal('well');
            expect(args.collection[0].qux.zip).to.equal('wer');
            expect(args.collection[1].foo.bar).to.equal('doo');
            expect(args.collection[1].foo.gee).to.equal('wee');
            expect(args.collection[1].qux.zip).to.equal('bop');
            expect(args.collection[1].qux.dup.goo.dod).to.equal('boo');
            expect(args.collection[2].qux.dup.goo.dod).to.equal('baa');
            expect(args.collection[3].foo.gee).to.equal('poo');
        });
    });
});
