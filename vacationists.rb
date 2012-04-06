#!/usr/bin/env ruby
require "rubygems"
require "bundler"
Bundler.setup

require 'sinatra'
require 'sinatra/base'
require 'haml'
require 'sass'
require 'bandcamp'
require 'yaml'

class Vacationists < Sinatra::Base
  set :haml, :format => :html5
  set :root, File.dirname(__FILE__)

  before do
    Bandcamp::Base.api_key = "loggjafarisvindrukkinnlokna"
  end

  get '/' do
    @album = load_album("266867348")
    haml :index
  end

  get '/style.css' do
    scss :stylesheet
  end

  def load_album(album_id)
    # if stub_exists?("album-#{album_id}")
    #   stub_json_request("http://api.bandcamp.com/api/album/2/info?album_id=#{album_id}&key=#{api_key}", "album-#{album_id}")
    # end

    album = Bandcamp::Album.load(album_id)
  end

  run! if app_file == $0
end
