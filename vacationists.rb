#!/usr/bin/env ruby
require "rubygems"
require "bundler"
Bundler.setup

require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  haml :index
end

get '/style.css' do
  scss :stylesheet
end